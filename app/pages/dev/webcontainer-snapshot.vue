<script setup lang="ts">
import { DownloadIcon, RefreshCwIcon, Trash2Icon } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import { WEB_CONTAINER_ADDONS } from "@/lib/challenge-runners/webcontainer/addons";
import {
  getSnapshot,
  removeSnapshot,
} from "@/lib/challenge-runners/webcontainer/services/snapshotCache";
import { WEB_CONTAINER_TEMPLATE_VERSION } from "@/lib/challenge-runners/webcontainer/template";

if (!import.meta.dev) {
  throw createError({ statusCode: 404, statusMessage: "Page not found" });
}

definePageMeta({
  layout: "blank",
});

const isLoading = ref(true);
const snapshots = reactive([
  {
    key: WEB_CONTAINER_TEMPLATE_VERSION,
    label: "Entorno base",
    snapshot: null as ArrayBuffer | null,
    targetPath: `public/webcontainer/${WEB_CONTAINER_TEMPLATE_VERSION}.snapshot`,
  },
  ...Object.values(WEB_CONTAINER_ADDONS).map((addon) => ({
    key: addon.cacheKey,
    label: Object.keys(addon.dependencies).join(", "),
    snapshot: null as ArrayBuffer | null,
    targetPath: `public${addon.snapshotPath}`,
  })),
]);

onMounted(loadSnapshot);

async function loadSnapshot() {
  isLoading.value = true;

  try {
    await Promise.all(
      snapshots.map(async (item) => {
        item.snapshot = await getSnapshot(item.key);
      }),
    );
  } finally {
    isLoading.value = false;
  }
}

function downloadSnapshot(item: (typeof snapshots)[number]) {
  if (!item.snapshot) return;

  const url = URL.createObjectURL(
    new Blob([item.snapshot], { type: "application/octet-stream" }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = item.targetPath.split("/").at(-1) ?? `${item.key}.snapshot`;
  link.click();
  URL.revokeObjectURL(url);
}

async function clearSnapshot(item: (typeof snapshots)[number]) {
  await removeSnapshot(item.key);
  await loadSnapshot();
}
</script>

<template>
  <main class="mx-auto flex min-h-dvh w-full max-w-xl flex-col justify-center p-6">
    <h1 class="text-xl font-semibold">WebContainer snapshot</h1>
    <p class="mt-2 text-sm text-muted-foreground">
      Exporta el entorno base y sus capas opcionales desde la cache local.
    </p>

    <div class="mt-6">
      <Button variant="outline" :disabled="isLoading" @click="loadSnapshot">
        <RefreshCwIcon :class="{ 'animate-spin': isLoading }" />
        Actualizar lista
      </Button>
    </div>

    <section
      v-for="item in snapshots"
      :key="item.key"
      class="border-b py-5 last:border-b-0"
    >
      <h2 class="font-medium">{{ item.label }}</h2>
      <code class="mt-1 block break-all text-xs text-muted-foreground">
        {{ item.targetPath }}
      </code>

      <p
        class="mt-3 text-sm"
        :class="item.snapshot ? 'text-primary' : 'text-muted-foreground'"
      >
        {{
          isLoading
            ? "Buscando snapshot..."
            : item.snapshot
              ? `Disponible (${(item.snapshot.byteLength / 1024 / 1024).toFixed(2)} MB).`
              : "No disponible. Abre un challenge que utilice este entorno."
        }}
      </p>

      <div class="mt-3 flex gap-3">
        <Button
          :disabled="!item.snapshot || isLoading"
          @click="downloadSnapshot(item)"
        >
          <DownloadIcon />
          Descargar
        </Button>
        <Button
          variant="outline"
          :disabled="!item.snapshot || isLoading"
          @click="clearSnapshot(item)"
        >
          <Trash2Icon />
          Borrar cache
        </Button>
      </div>
    </section>
  </main>
</template>
