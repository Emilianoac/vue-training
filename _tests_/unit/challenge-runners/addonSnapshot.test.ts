import type { WebContainer } from "@webcontainer/api";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { WEB_CONTAINER_ADDONS } from "@/lib/challenge-runners/webcontainer/addons";
import {
  cacheInstalledAddon,
  restoreAddonSnapshot,
} from "@/lib/challenge-runners/webcontainer/services/addonSnapshot";

const snapshotCache = vi.hoisted(() => ({
  prepareSnapshot: vi.fn(),
  removeSnapshot: vi.fn(),
  saveSnapshot: vi.fn(),
}));

vi.mock("@/lib/challenge-runners/webcontainer/services/snapshotCache", () => snapshotCache);

const addon = WEB_CONTAINER_ADDONS["vue-router"];

describe("addonSnapshot", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("mounts a prepared addon at its configured path", async () => {
    const snapshot = new Uint8Array([1, 2, 3]).buffer;
    const container = createContainer();
    snapshotCache.prepareSnapshot.mockResolvedValue({ snapshot, source: "indexeddb" });

    const restored = await restoreAddonSnapshot(container.value, addon);

    expect(restored).toBe(true);
    expect(container.mkdir).toHaveBeenCalledWith(addon.mountPoint, { recursive: true });
    expect(container.mount).toHaveBeenCalledWith(snapshot, { mountPoint: addon.mountPoint });
  });

  it("exports and caches an installed addon independently", async () => {
    const exported = new Uint8Array([4, 5, 6]);
    const container = createContainer(exported);

    const cached = await cacheInstalledAddon(container.value, addon);

    expect(cached).toBe(true);
    expect(container.exportProject).toHaveBeenCalledWith(addon.exportPath, {
      format: "binary",
    });
    expect(snapshotCache.saveSnapshot).toHaveBeenCalledWith(
      addon.cacheKey,
      expect.any(ArrayBuffer),
    );
  });
});

function createContainer(exported = new Uint8Array()) {
  const mkdir = vi.fn().mockResolvedValue(undefined);
  const mount = vi.fn().mockResolvedValue(undefined);
  const exportProject = vi.fn().mockResolvedValue(exported);

  return {
    value: {
      export: exportProject,
      fs: { mkdir },
      mount,
    } as unknown as WebContainer,
    exportProject,
    mkdir,
    mount,
  };
}
