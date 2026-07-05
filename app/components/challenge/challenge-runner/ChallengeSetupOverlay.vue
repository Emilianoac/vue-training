<script setup lang="ts">
import { Loader2Icon, PackageOpenIcon, LightbulbIcon } from "lucide-vue-next";
import Vuecito from "@/components/assets/illustrations/Vuecito.vue";
import { loadingMessages } from "@/constants/loading-screen-tips";

import { Progress } from "@/components/ui/progress";

const props = defineProps<{
  complete: boolean;
  stage: string;
}>();

const { locale, t } = useI18n();
const elapsedSeconds = ref(0);
const simulatedProgress = ref(8);
const selectedTip = loadingMessages[Math.floor(Math.random() * loadingMessages.length)];
const localizedTip = computed(() => selectedTip?.[locale.value === "es" ? "es" : "en"] ?? "");

let timer: number | undefined;
let progressTimer: number | undefined;

onMounted(() => {
  timer = window.setInterval(() => {
    elapsedSeconds.value++;
  }, 1000);

  progressTimer = window.setInterval(() => {
    if (props.complete || simulatedProgress.value >= 92) return;

    const remaining = 92 - simulatedProgress.value;
    simulatedProgress.value = Math.min(
      92,
      simulatedProgress.value + Math.max(0.5, remaining * 0.08),
    );
  }, 400);
});

onBeforeUnmount(() => {
  if (timer) window.clearInterval(timer);
  if (progressTimer) window.clearInterval(progressTimer);
});

watch(
  () => props.complete,
  (complete) => {
    if (complete) simulatedProgress.value = 100;
  },
);
</script>

<template>
  <div
    class="absolute inset-0 z-100 flex items-center justify-center bg-(--editor-panel-surface-background) px-6 text-(--editor-foreground)"
    role="status"
    aria-live="polite"
  >
    <div class="grid w-full max-w-2xl items-end gap-6 sm:grid-cols-[minmax(0,1fr)_140px] sm:gap-8">
      <div>
        <div
          class="mb-5 flex size-12 items-center justify-center rounded-md bg-primary/10 text-primary"
        >
          <PackageOpenIcon class="size-6" />
        </div>

        <h2 class="text-xl font-semibold">{{ t("challenge.runner.firstSetup.title") }}</h2>
        <p class="mt-2 text-sm leading-6 text-muted-foreground">
          {{ t("challenge.runner.firstSetup.description") }}
        </p>

        <Progress class="my-6 h-1" :model-value="simulatedProgress" animated />

        <div class="flex items-center justify-between gap-4 text-sm">
          <span class="flex min-w-0 items-center gap-2">
            <Loader2Icon class="size-4 shrink-0 animate-spin text-primary" />
            <span class="truncate">{{ stage }}</span>
          </span>
          <span class="shrink-0 font-mono text-xs text-muted-foreground">
            {{ t("challenge.runner.firstSetup.elapsed", { seconds: elapsedSeconds }) }}
          </span>
        </div>

        <div
          v-if="localizedTip"
          class="bg-(--editor-background) mt-8 border-l-3 border-primary pl-4 p-4 rounded-tr-md rounded-br-md"
        >
          <div class="flex items-center text-xs font-medium text-muted-foreground gap-1">
            <LightbulbIcon :size="16" />
            <p>
              {{ t("challenge.runner.firstSetup.tip") }}
            </p>
          </div>
          <p class="mt-1 text-sm">{{ localizedTip }}</p>
        </div>
      </div>

      <Vuecito class="mx-auto h-auto w-24 sm:w-full" tip-id="challenge-first-setup" />
    </div>
  </div>
</template>
