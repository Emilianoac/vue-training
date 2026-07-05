import { beforeEach, describe, expect, it } from "vitest";
import {
  getSnapshot,
  removeSnapshot,
  saveSnapshot,
} from "@/lib/challenge-runners/webcontainer/services/snapshotCache";

const SNAPSHOT_KEY = "test-snapshot";

describe("snapshotCache", () => {
  beforeEach(async () => {
    await removeSnapshot(SNAPSHOT_KEY);
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
});
