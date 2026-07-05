const DATABASE_NAME = "vue-training-webcontainer";
const DATABASE_VERSION = 1;
const STORE_NAME = "snapshots";

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
      store.clear();
      store.put(snapshot, key);
      transaction.addEventListener("complete", () => resolve());
      transaction.addEventListener("abort", () => reject(transaction.error));
      transaction.addEventListener("error", () => reject(transaction.error));
    });
  } finally {
    database.close();
  }
}

export async function removeSnapshot(key: string): Promise<void> {
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
