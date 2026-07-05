import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  getSnapshot,
  prepareSnapshot,
  removeSnapshot,
  saveSnapshot,
} from "@/lib/challenge-runners/webcontainer/services/snapshotCache";

const SNAPSHOT_KEY = "test-snapshot";

describe("snapshotCache", () => {
  beforeEach(async () => {
    await removeSnapshot(SNAPSHOT_KEY);
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

  it("keeps only the latest template snapshot", async () => {
    await saveSnapshot("old-template", new Uint8Array([1]).buffer);
    await saveSnapshot("new-template", new Uint8Array([2]).buffer);

    const latestSnapshot = await getSnapshot("new-template");

    expect(await getSnapshot("old-template")).toBeNull();
    expect(latestSnapshot).toBeInstanceOf(ArrayBuffer);
    expect([...new Uint8Array(latestSnapshot!)]).toEqual([2]);
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
