const DATABASE_NAME = "vue-training-webcontainer";
const DATABASE_VERSION = 1;
const STORE_NAME = "snapshots";
const PREPARED_SNAPSHOT_KEY_PREFIX = "webcontainer-snapshot-prepared:";

export type PreparedSnapshot = {
  snapshot: ArrayBuffer;
  source: "indexeddb" | "static";
};

const snapshotRequests = new Map<string, Promise<PreparedSnapshot | null>>();

export function prepareSnapshot(key: string, staticUrl: string): Promise<PreparedSnapshot | null> {
  const pendingRequest = snapshotRequests.get(key);
  if (pendingRequest) return pendingRequest;

  const request = loadSnapshot(key, staticUrl).finally(() => {
    snapshotRequests.delete(key);
  });
  snapshotRequests.set(key, request);
  return request;
}

export function hasPreparedSnapshotHint(key: string): boolean {
  try {
    return globalThis.localStorage?.getItem(`${PREPARED_SNAPSHOT_KEY_PREFIX}${key}`) === "true";
  } catch {
    return false;
  }
}

export async function getSnapshot(key: string): Promise<ArrayBuffer | null> {
  if (!globalThis.indexedDB) return null;

  const database = await openDatabase();

  try {
    return await new Promise<ArrayBuffer | null>((resolve, reject) => {
      const request = database.transaction(STORE_NAME, "readonly").objectStore(STORE_NAME).get(key);

      request.addEventListener("success", () => {
        resolve(request.result instanceof ArrayBuffer ? request.result : null);
      });
      request.addEventListener("error", () => reject(request.error));
    });
  } finally {
    database.close();
  }
}

export async function saveSnapshot(key: string, snapshot: ArrayBuffer): Promise<void> {
  if (!globalThis.indexedDB) return;

  const database = await openDatabase();

  try {
    await new Promise<void>((resolve, reject) => {
      const transaction = database.transaction(STORE_NAME, "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      store.put(snapshot, key);
      transaction.addEventListener("complete", () => {
        setPreparedSnapshotHint(key, true);
        resolve();
      });
      transaction.addEventListener("abort", () => reject(transaction.error));
      transaction.addEventListener("error", () => reject(transaction.error));
    });
  } finally {
    database.close();
  }
}

export async function removeSnapshot(key: string): Promise<void> {
  snapshotRequests.delete(key);
  setPreparedSnapshotHint(key, false);
  if (!globalThis.indexedDB) return;

  const database = await openDatabase();

  try {
    await new Promise<void>((resolve, reject) => {
      const transaction = database.transaction(STORE_NAME, "readwrite");
      transaction.objectStore(STORE_NAME).delete(key);
      transaction.addEventListener("complete", () => resolve());
      transaction.addEventListener("abort", () => reject(transaction.error));
      transaction.addEventListener("error", () => reject(transaction.error));
    });
  } finally {
    database.close();
  }
}

function setPreparedSnapshotHint(key: string, prepared: boolean) {
  try {
    const storageKey = `${PREPARED_SNAPSHOT_KEY_PREFIX}${key}`;
    if (prepared) globalThis.localStorage?.setItem(storageKey, "true");
    else globalThis.localStorage?.removeItem(storageKey);
  } catch {
    // Storage can be unavailable in private or restricted browser contexts.
  }
}

async function loadSnapshot(key: string, staticUrl: string): Promise<PreparedSnapshot | null> {
  const cachedSnapshot = await getSnapshot(key);
  if (cachedSnapshot) {
    return {
      snapshot: cachedSnapshot,
      source: "indexeddb",
    };
  }

  const response = await fetch(staticUrl, { cache: "force-cache" });
  if (!response.ok) return null;

  const staticSnapshot = await response.arrayBuffer();
  if (!staticSnapshot.byteLength) return null;

  try {
    await saveSnapshot(key, staticSnapshot);
  } catch {
    // The downloaded snapshot can still be used for this session.
  }

  return {
    snapshot: staticSnapshot,
    source: "static",
  };
}

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);

    request.addEventListener("upgradeneeded", () => {
      if (!request.result.objectStoreNames.contains(STORE_NAME)) {
        request.result.createObjectStore(STORE_NAME);
      }
    });
    request.addEventListener("success", () => resolve(request.result));
    request.addEventListener("error", () => reject(request.error));
  });
}
