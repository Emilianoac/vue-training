import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  getSnapshot,
  prepareSnapshot,
  removeSnapshot,
  saveSnapshot,
} from "@/lib/challenge-runners/webcontainer/services/snapshotCache";

const SNAPSHOT_KEY = "test-snapshot";
const TEST_SNAPSHOT_KEYS = [
  SNAPSHOT_KEY,
  "base-template",
  "static-template",
  "vue-router-addon",
];

describe("snapshotCache", () => {
  beforeEach(async () => {
    await Promise.all(TEST_SNAPSHOT_KEYS.map((key) => removeSnapshot(key)));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("stores and restores a binary snapshot", async () => {
    const source = new Uint8Array([1, 2, 3, 4]).buffer;

    await saveSnapshot(SNAPSHOT_KEY, source);
    const restored = await getSnapshot(SNAPSHOT_KEY);

    expect(restored).toBeInstanceOf(ArrayBuffer);
    expect([...new Uint8Array(restored!)]).toEqual([1, 2, 3, 4]);
  });

  it("removes a cached snapshot", async () => {
    await saveSnapshot(SNAPSHOT_KEY, new Uint8Array([1]).buffer);

    await removeSnapshot(SNAPSHOT_KEY);

    expect(await getSnapshot(SNAPSHOT_KEY)).toBeNull();
  });

  it("keeps independent snapshots under different keys", async () => {
    await saveSnapshot("base-template", new Uint8Array([1]).buffer);
    await saveSnapshot("vue-router-addon", new Uint8Array([2]).buffer);

    const baseSnapshot = await getSnapshot("base-template");
    const addonSnapshot = await getSnapshot("vue-router-addon");

    expect([...new Uint8Array(baseSnapshot!)]).toEqual([1]);
    expect([...new Uint8Array(addonSnapshot!)]).toEqual([2]);
  });

  it("downloads and persists a static snapshot when the cache is empty", async () => {
    const staticKey = "static-template";
    await removeSnapshot(staticKey);
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(new Uint8Array([5, 6, 7]), {
          status: 200,
        }),
      ),
    );

    const prepared = await prepareSnapshot(staticKey, "/webcontainer/static.snapshot");

    expect(prepared?.source).toBe("static");
    expect([...new Uint8Array(prepared!.snapshot)]).toEqual([5, 6, 7]);
    expect([...new Uint8Array((await getSnapshot(staticKey))!)]).toEqual([5, 6, 7]);
  });
});
