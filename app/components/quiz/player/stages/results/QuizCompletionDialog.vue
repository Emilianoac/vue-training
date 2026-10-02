<script lang="ts" setup>
import type { QuizOutcome } from "@/domain/quiz/getQuizOutcome";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import vueHostImageHappy from "@/assets/images/quiz/vue-host.png";
import vueHostImageSad from "@/assets/images/quiz/vue-host-sad.png";
import useQuizCompletionConfetti from "./useQuizCompletionConfetti";

const open = defineModel<boolean>("open", { required: true });

const props = defineProps<{
  outcome: QuizOutcome;
  percentage: number;
  requiredPercentage: number;
  mode: "standalone" | "learning-path";
}>();

const emit = defineEmits<{
  primaryAction: [];
  reviewResults: [];
}>();

const { t } = useI18n();

const presentation = computed(() => {
  if (props.outcome === "failed") {
    return {
      eyebrow: t("quiz.completion.failedEyebrow"),
      title: t("quiz.completion.failedTitle"),
      description: t("quiz.completion.failedMessage", {
        percentage: props.requiredPercentage,
      }),
      icon: "mdi:close-circle-outline",
      hostImage: vueHostImageSad,
    };
  }

  if (props.outcome === "perfect") {
    return {
      eyebrow: t("quiz.completion.perfectEyebrow"),
      title: t("quiz.completion.perfectTitle"),
      description: t(
        props.mode === "learning-path"
          ? "quiz.completion.perfectLearningPathMessage"
          : "quiz.completion.perfectStandaloneMessage",
      ),
      icon: "mdi:star-circle-outline",
      hostImage: vueHostImageHappy,
    };
  }

  return {
    eyebrow: t("quiz.completion.passedEyebrow"),
    title: t("quiz.completion.passedTitle"),
    description: t(
      props.mode === "learning-path"
        ? "quiz.completion.passedLearningPathMessage"
        : "quiz.completion.passedStandaloneMessage",
    ),
    icon: "mdi:check-decagram-outline",
    hostImage: vueHostImageHappy,
  };
});

const primaryActionLabel = computed(() => {
  if (props.outcome === "failed" || props.mode === "standalone") {
    return t("quiz.results.retake_quiz");
  }

  return t("quiz.completion.continueLearningPath");
});

useQuizCompletionConfetti(
  () => open.value,
  () => props.outcome,
);

function handlePrimaryAction() {
  open.value = false;
  emit("primaryAction");
}

function handleReviewResults() {
  open.value = false;
  emit("reviewResults");
}
</script>

<template>
  <Dialog v-model:open="open">
    <DialogContent
      :data-outcome="outcome"
      overlay-class="z-50 backdrop-blur-[2px]"
      class="completion-dialog z-[52] p-0 max-h-[calc(100dvh-2rem)] gap-0 overflow-y-auto text-slate-100 shadow-2xl w-[calc(100%-2rem)] sm:max-w-[900px]"
    >
      <div class="grid min-h-0 md:grid-cols-[minmax(280px,0.8fr)_minmax(0,1.35fr)]">
        <div class="completion-stage">
          <div class="stage-light" aria-hidden="true"></div>
          <img
            :src="presentation.hostImage"
            alt=""
            class="relative z-10 mt-5 w-36 drop-shadow-2xl sm:w-44 md:mt-0 md:w-52"
            :class="{ 'opacity-60 grayscale-75': outcome === 'failed' }"
          />

          <div class="score-card relative z-10">
            <strong class="outcome-text block text-5xl font-extrabold tracking-tight md:text-6xl">
              {{ percentage }}%
            </strong>
            <span class="mt-1 block text-sm text-slate-300">
              {{ $t("quiz.completion.goal", { percentage: requiredPercentage }) }}
            </span>
          </div>
        </div>

        <div class="flex min-w-0 flex-col justify-center p-8">
          <div class="outcome-text mb-3 flex items-center gap-2 text-xs font-bold tracking-wider">
            <Icon :name="presentation.icon" size="1.8em" />
            <span>{{ presentation.eyebrow }}</span>
          </div>

          <DialogTitle class="text-3xl leading-tight font-extrabold tracking-tight">
            {{ presentation.title }}
          </DialogTitle>
          <DialogDescription class="mt-2 text-base leading-relaxed text-slate-400">
            {{ presentation.description }}
          </DialogDescription>

          <div class="score-comparison mt-6 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
            <div class="flex min-w-0 items-center gap-3">
              <span class="outcome-icon">
                <Icon :name="presentation.icon" size="1.5em" />
              </span>
              <div class="min-w-0">
                <strong class="outcome-text block text-2xl leading-none">{{ percentage }}%</strong>
                <span class="mt-1 block truncate text-xs text-slate-400">
                  {{ $t("quiz.results.your_score") }}
                </span>
              </div>
            </div>

            <Icon name="mdi:chevron-right" class="size-7 text-slate-600" />

            <div class="min-w-0">
              <strong class="block text-2xl leading-none text-slate-300">
                {{ requiredPercentage }}%
              </strong>
              <span class="mt-1 block truncate text-xs text-slate-500">
                {{ $t("quiz.completion.target") }}
              </span>
            </div>
          </div>

          <hr class="my-6" />

          <div class="space-y-2">
            <Button size="xl" class="w-full text-base" @click="handlePrimaryAction">
              {{ primaryActionLabel }}
              <Icon
                :name="
                  outcome === 'failed' || mode === 'standalone' ? 'mdi:replay' : 'mdi:arrow-right'
                "
                class="size-5"
              />
            </Button>
            <Button
              variant="ghost"
              size="lg"
              class="w-full text-slate-400 hover:bg-slate-800 hover:text-slate-100"
              @click="handleReviewResults"
            >
              {{ $t("quiz.completion.reviewResults") }}
              <Icon name="mdi:eye" class="size-5" />
            </Button>
          </div>
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>

<style lang="css">
.completion-dialog {
  --outcome-color: var(--primary);
  --outcome-soft: color-mix(in oklch, var(--primary) 18%, transparent);
}

.completion-dialog[data-outcome="failed"] {
  --outcome-color: var(--destructive);
  --outcome-soft: color-mix(in oklch, var(--destructive) 18%, transparent);
}

.completion-dialog[data-outcome="perfect"] {
  --outcome-color: oklch(0.85 0.17 91);
  --outcome-soft: color-mix(in oklch, oklch(0.85 0.17 91) 18%, transparent);
}

.outcome-text {
  color: var(--outcome-color);
}

.completion-stage {
  position: relative;
  display: flex;
  min-height: 310px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-bottom: 1px solid color-mix(in oklch, var(--border) 75%, transparent);
  background:
    radial-gradient(circle at 50% 38%, var(--outcome-soft), transparent 42%),
    linear-gradient(155deg, color-mix(in oklch, var(--outcome-color) 8%, #07111f), #07111f 70%);
}

.stage-light {
  position: absolute;
  top: -45%;
  width: 58%;
  height: 100%;
  opacity: 0.5;
  background: linear-gradient(to bottom, var(--outcome-soft), transparent 80%);
  clip-path: polygon(36% 0, 64% 0, 100% 100%, 0 100%);
  filter: blur(4px);
}

.score-card {
  width: min(76%, 235px);
  margin-top: -0.75rem;
  border: 1px solid var(--outcome-color);
  border-radius: 0.9rem;
  padding: 0.85rem 1rem;
  background: color-mix(in oklch, #07111f 88%, transparent);
  text-align: center;
  box-shadow: 0 0 32px var(--outcome-soft);
}

.score-comparison {
  border: 1px solid color-mix(in oklch, var(--border) 65%, transparent);
  border-radius: 0.75rem;
  padding: 1rem;
  background: color-mix(in oklch, var(--outcome-soft) 26%, #111c2d);
}

.outcome-icon {
  display: grid;
  width: 2.75rem;
  height: 2.75rem;
  flex: none;
  place-items: center;
  border-radius: 999px;
  color: var(--outcome-color);
  background: var(--outcome-soft);
  box-shadow: 0 0 22px var(--outcome-soft);
}

@media (min-width: 768px) {
  .completion-stage {
    border-right: 1px solid color-mix(in oklch, var(--border) 75%, transparent);
    border-bottom: 0;
  }
}
</style>
