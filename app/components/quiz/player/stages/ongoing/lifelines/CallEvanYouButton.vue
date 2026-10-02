<script setup lang="ts">
import { PhoneCallIcon } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import dialingSoundUrl from "@/assets/audio/quiz/call-evan-dialing.wav?url";

const props = defineProps<{
  used: boolean;
  disabled?: boolean;
}>();

const emit = defineEmits<{
  activate: [];
  connected: [];
}>();

const { t } = useI18n();
const isDialing = ref(false);
let dialingAudio: HTMLAudioElement | null = null;
let connectionTimer: ReturnType<typeof setTimeout> | undefined;

const buttonLabel = computed(() => {
  if (isDialing.value) return t("quiz.lifeline.calling");
  if (props.used) return t("quiz.lifeline.used");
  return t("quiz.lifeline.callEvan");
});

const tooltipText = computed(() => {
  if (props.used && !isDialing.value) return t("quiz.lifeline.usedDescription");
  if (props.disabled) return t("quiz.lifeline.unavailableDescription");
  return t("quiz.lifeline.callDescription");
});

function clearConnectionTimer() {
  if (connectionTimer === undefined) return;

  clearTimeout(connectionTimer);
  connectionTimer = undefined;
}

function finishDialing() {
  if (!isDialing.value) return;

  clearConnectionTimer();
  isDialing.value = false;
  emit("connected");
}

function callEvan() {
  if (props.disabled || props.used || isDialing.value) return;

  emit("activate");
  isDialing.value = true;

  initializeDialingAudio();
  if (!dialingAudio) {
    finishDialing();
    return;
  }

  dialingAudio.currentTime = 0;
  dialingAudio.addEventListener("ended", finishDialing, { once: true });
  void dialingAudio.play().catch(() => finishDialing());

  connectionTimer = setTimeout(finishDialing, 2300);
}

function initializeDialingAudio() {
  if (dialingAudio) return;

  dialingAudio = new Audio(dialingSoundUrl);
  dialingAudio.preload = "auto";
  dialingAudio.load();
}

onMounted(initializeDialingAudio);

onBeforeUnmount(() => {
  clearConnectionTimer();
  dialingAudio?.pause();
  dialingAudio = null;
});
</script>

<template>
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger as-child>
        <span class="inline-flex rounded-md">
          <Button
            type="button"
            variant="outline"
            size="icon"
            class="relative overflow-hidden"
            data-quiz-click-sound="off"
            :class="[
              isDialing &&
                'border-primary bg-primary/10 text-primary disabled:opacity-100! motion-safe:animate-pulse',
              used &&
                !isDialing &&
                'border-muted-foreground/20 bg-muted/30 text-muted-foreground grayscale disabled:opacity-40!',
            ]"
            :disabled="disabled || used || isDialing"
            :aria-label="buttonLabel"
            @click="callEvan"
          >
            <span
              v-if="isDialing"
              class="pointer-events-none absolute top-1/2 left-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/35 motion-safe:animate-ping"
              aria-hidden="true"
            ></span>
            <PhoneCallIcon
              class="relative z-10"
              :class="isDialing && 'motion-safe:animate-bounce'"
            />
          </Button>
        </span>
      </TooltipTrigger>
      <TooltipContent class="max-w-64 text-center">
        {{ tooltipText }}
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
</template>
