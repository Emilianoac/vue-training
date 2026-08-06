export const WEB_CONTAINER_ADDONS = {
  pinia: {
    cacheKey: "webcontainer-addon-pinia-3.0.4",
    dependencies: {
      pinia: "3.0.4",
    },
    exportPath: "node_modules/pinia",
    mountPoint: "node_modules/pinia",
    snapshotPath: "/webcontainer/addons/pinia-3.0.4.snapshot",
  },
  "vue-router": {
    cacheKey: "webcontainer-addon-vue-router-5.1.0",
    dependencies: {
      "vue-router": "5.1.0",
    },
    exportPath: "node_modules/vue-router",
    mountPoint: "node_modules/vue-router",
    snapshotPath: "/webcontainer/addons/vue-router-5.1.0.snapshot",
  },
} as const;

export type WebContainerAddonId = keyof typeof WEB_CONTAINER_ADDONS;
export type WebContainerAddon = (typeof WEB_CONTAINER_ADDONS)[WebContainerAddonId];
