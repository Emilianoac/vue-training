<script setup lang="ts">
import { DownloadIcon, RefreshCwIcon, Trash2Icon } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
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

const snapshot = shallowRef<ArrayBuffer | null>(null);
const isLoading = ref(true);
const snapshotFilename = `${WEB_CONTAINER_TEMPLATE_VERSION}.snapshot`;

onMounted(loadSnapshot);

async function loadSnapshot() {
  isLoading.value = true;

  try {
    snapshot.value = await getSnapshot(WEB_CONTAINER_TEMPLATE_VERSION);
  } finally {
    isLoading.value = false;
  }
}

function downloadSnapshot() {
  if (!snapshot.value) return;

  const url = URL.createObjectURL(
    new Blob([snapshot.value], { type: "application/octet-stream" }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = snapshotFilename;
  link.click();
  URL.revokeObjectURL(url);
}

async function clearSnapshot() {
  await removeSnapshot(WEB_CONTAINER_TEMPLATE_VERSION);
  await loadSnapshot();
}
</script>

<template>
  <main class="mx-auto flex min-h-dvh w-full max-w-xl flex-col justify-center p-6">
    <h1 class="text-xl font-semibold">WebContainer snapshot</h1>
    <p class="mt-2 text-sm text-muted-foreground">
      Exporta el entorno instalado y guardalo en
      <code>public/webcontainer/{{ snapshotFilename }}</code>.
    </p>

    <div class="mt-6 flex items-center gap-3">
      <Button :disabled="!snapshot || isLoading" @click="downloadSnapshot">
        <DownloadIcon />
        Descargar snapshot
      </Button>
      <Button variant="outline" :disabled="isLoading" @click="loadSnapshot">
        <RefreshCwIcon :class="{ 'animate-spin': isLoading }" />
        Actualizar
      </Button>
      <Button variant="outline" :disabled="isLoading" @click="clearSnapshot">
        <Trash2Icon />
        Borrar cache
      </Button>
    </div>

    <p class="mt-4 text-sm" :class="snapshot ? 'text-primary' : 'text-muted-foreground'">
      {{
        isLoading
          ? "Buscando snapshot..."
          : snapshot
            ? `Snapshot disponible (${(snapshot.byteLength / 1024 / 1024).toFixed(2)} MB).`
            : "No hay un snapshot. Abre primero un challenge y espera a que termine la instalacion."
      }}
    </p>
  </main>
</template>
