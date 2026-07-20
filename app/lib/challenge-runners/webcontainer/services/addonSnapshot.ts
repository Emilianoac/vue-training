import type { WebContainer } from "@webcontainer/api";
import type { WebContainerAddon } from "../addons";
import { prepareSnapshot, removeSnapshot, saveSnapshot } from "./snapshotCache";

export async function restoreAddonSnapshot(
  container: WebContainer,
  addon: WebContainerAddon,
): Promise<boolean> {
  try {
    const preparedSnapshot = await prepareSnapshot(addon.cacheKey, addon.snapshotPath);
    if (!preparedSnapshot) return false;

    await container.fs.mkdir(addon.mountPoint, { recursive: true });
    await container.mount(preparedSnapshot.snapshot, {
      mountPoint: addon.mountPoint,
    });
    return true;
  } catch {
    await removeSnapshot(addon.cacheKey);
    return false;
  }
}

export async function cacheInstalledAddon(
  container: WebContainer,
  addon: WebContainerAddon,
): Promise<boolean> {
  try {
    const exported = await container.export(addon.exportPath, {
      format: "binary",
    });
    if (!(exported instanceof Uint8Array)) return false;

    await saveSnapshot(addon.cacheKey, new Uint8Array(exported).slice().buffer);
    return true;
  } catch {
    return false;
  }
}
