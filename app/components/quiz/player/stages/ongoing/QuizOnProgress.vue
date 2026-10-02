<script lang="ts" setup>
import type { Question } from "@/schemas/quiz.schema";
import { CheckCircleIcon, CircleXIcon, XIcon } from "lucide-vue-next";
import HighlightedCodeBlock from "@/components/content/HighlightedCodeBlock.vue";
import QuizAnswerList from "./QuizAnswerList.vue";
import QuizProgress from "./QuizProgress.vue";
import QuizQuestion from "./QuizQuestion.vue";
import { Button } from "@/components/ui/button";
import vueHostUrl from "@/assets/images/quiz/vue-host.png";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

const props = defineProps<{
  totalQuestions: number;
  quizProgress: number;
  currentQuestionIndex: number;
  currentQuestion: Question | null;
  hasCheckedAnswer: boolean;
  selectedOptionId: string | null;
}>();

const emits = defineEmits<{
  (e: "answerCurrentQuestion"): void;
  (e: "goToNextQuestion"): void;
  (e: "update:selectedOptionId", value: string | null): void;
}>();

const correctAnswerAudio = ref<HTMLAudioElement | null>(null);
const wrongAnswerAudio = ref<HTMLAudioElement | null>(null);
const feedbackOpen = ref(false);
const feedbackViewKey = ref(0);
const isContinuing = ref(false);
const quizContainer = useTemplateRef<HTMLElement>("quizContainer");
const { parse } = useMarkdownParser();

const ANSWER_RESULT_SOUND_DELAY_MS = 180;
const FEEDBACK_CLOSE_TRANSITION_MS = 250;
let answerResultSoundTimer: ReturnType<typeof setTimeout> | undefined;
let feedbackCloseTimer: ReturnType<typeof setTimeout> | undefined;

const selectedAnswer = computed(
  () =>
    props.currentQuestion?.answers.find((answer) => answer.id === props.selectedOptionId) ?? null,
);
const correctAnswer = computed(
  () => props.currentQuestion?.answers.find((answer) => answer.isCorrect) ?? null,
);
const answerWasCorrect = computed(() => selectedAnswer.value?.isCorrect ?? false);
const parsedQuestion = computed(() => parse(props.currentQuestion?.text ?? ""));
const parsedSelectedAnswer = computed(() => parse(selectedAnswer.value?.text ?? ""));
const parsedCorrectAnswer = computed(() => parse(correctAnswer.value?.text ?? ""));
const parsedExplanation = computed(() => parse(props.currentQuestion?.explanation ?? ""));
const explanationCode = computed(() => props.currentQuestion?.explanation_code ?? []);

function verifyCurrentAnswer() {
  const selectedAnswer = props.currentQuestion?.answers.find(
    (answer) => answer.id === props.selectedOptionId,
  );
  if (!selectedAnswer) return;

  emits("answerCurrentQuestion");
  openFeedback();

  clearAnswerResultSoundTimer();
  answerResultSoundTimer = setTimeout(() => {
    const audio = selectedAnswer.isCorrect ? correctAnswerAudio.value : wrongAnswerAudio.value;
    if (!audio) return;

    audio.currentTime = 0;
    void audio.play().catch(() => undefined);
  }, ANSWER_RESULT_SOUND_DELAY_MS);
}

function clearAnswerResultSoundTimer() {
  if (answerResultSoundTimer === undefined) return;

  clearTimeout(answerResultSoundTimer);
  answerResultSoundTimer = undefined;
}

function openFeedback() {
  feedbackViewKey.value += 1;
  feedbackOpen.value = true;
}

function closeFeedback() {
  feedbackOpen.value = false;
}

function continueQuiz() {
  if (isContinuing.value) return;

  clearAnswerResultSoundTimer();

  if (!feedbackOpen.value) {
    emits("goToNextQuestion");
    return;
  }

  isContinuing.value = true;
  closeFeedback();

  feedbackCloseTimer = setTimeout(() => {
    emits("goToNextQuestion");
    isContinuing.value = false;
    feedbackCloseTimer = undefined;
  }, FEEDBACK_CLOSE_TRANSITION_MS);
}

watch(
  () => props.currentQuestionIndex,
  async () => {
    await nextTick();

    if (!import.meta.client || !window.matchMedia("(max-width: 767px)").matches) return;

    const viewport = quizContainer.value?.querySelector<HTMLElement>(
      '.quiz-content-scroll [data-slot="scroll-area-viewport"]',
    );

    if (viewport) viewport.scrollTop = 0;
  },
  { flush: "post" },
);

onBeforeUnmount(() => {
  clearAnswerResultSoundTimer();

  if (feedbackCloseTimer !== undefined) {
    clearTimeout(feedbackCloseTimer);
  }
});
</script>

<template>
  <div
    ref="quizContainer"
    class="quiz-on-progress relative flex h-full max-h-full min-h-0 w-full flex-col overflow-hidden"
    v-if="currentQuestion"
  >
    <ScrollArea
      type="auto"
      class="quiz-content-scroll min-h-0 flex-1 md:flex md:flex-col md:gap-4"
      viewport-class="md:contents"
      scrollbar-class="md:hidden"
    >
      <div class="flex min-h-full flex-col gap-5 pr-3 md:contents space-y-2">
        <!-- Progress -->
        <QuizProgress
          :progress="quizProgress"
          :currentQuestionIndex="currentQuestionIndex"
          :quizLength="totalQuestions"
          class="sticky top-0"
        />
        <div class="grid grid-cols-1 gap-4 md:grid-cols-[200px_1fr]">
          <div>
            <img :src="vueHostUrl" class="mx-auto max-w-[90px] md:max-w-[180px]" />
          </div>
          <QuizQuestion
            :key="currentQuestionIndex"
            class="min-w-0 flex-1"
            :text="currentQuestion.text"
          />
        </div>

        <div class="relative flex flex-col space-y-4 md:min-h-0 md:flex-auto md:overflow-hidden">
          <!-- Quiz Container -->
          <div class="mx-auto w-full md:min-h-0 md:flex-auto md:overflow-hidden">
            <div v-if="currentQuestion" class="flex flex-col gap-2 md:h-full md:min-h-0">
              <!-- Answer options -->
              <ScrollArea
                type="auto"
                class="answer-options-scroll min-h-0 max-md:contents md:flex-1 md:overflow-hidden"
                viewport-class="max-md:contents"
                scrollbar-class="max-md:hidden"
              >
                <QuizAnswerList
                  :answers="currentQuestion.answers"
                  :selected-option="selectedOptionId"
                  :show-answer-result="hasCheckedAnswer"
                  @update:selected-option="emits('update:selectedOptionId', $event)"
                />
              </ScrollArea>
            </div>
          </div>

          <Dialog v-model:open="feedbackOpen">
            <DialogContent
              v-if="currentQuestion && selectedAnswer && correctAnswer"
              :show-close-button="false"
              class="grid min-w-0 max-h-[calc(100dvh_-_6rem)] grid-rows-[auto_minmax(0,1fr)_auto] gap-0 overflow-hidden rounded-xl bg-card p-0 sm:max-w-4xl md:max-h-[calc(100dvh_-_5rem)]"
              overlay-class="bg-background/60 backdrop-blur-[1px]"
            >
              <DialogHeader class="relative gap-0 border-b px-6 py-4 text-left">
                <div class="absolute top-3 right-4">
                  <DialogClose as-child>
                    <Button
                      size="icon-sm"
                      variant="ghost"
                      :aria-label="$t('quiz.feedback.close')"
                      :title="$t('quiz.feedback.close')"
                      @click="closeFeedback"
                    >
                      <XIcon />
                    </Button>
                  </DialogClose>
                </div>

                <DialogTitle class="flex items-center gap-2 pr-12 text-base">
                  <div
                    class="flex size-6 shrink-0 items-center justify-center rounded-full"
                    :class="
                      answerWasCorrect
                        ? 'bg-primary/10 text-primary'
                        : 'bg-destructive/10 text-destructive'
                    "
                  >
                    <CheckCircleIcon v-if="answerWasCorrect" class="size-6" />
                    <CircleXIcon v-else class="size-5" />
                  </div>
                  <span>
                    {{
                      $t(
                        answerWasCorrect
                          ? "quiz.feedback.correctTitle"
                          : "quiz.feedback.incorrectTitle",
                      )
                    }}
                  </span>
                </DialogTitle>
              </DialogHeader>

              <ScrollArea
                :key="`${currentQuestionIndex}-${feedbackViewKey}`"
                type="auto"
                class="min-h-0 min-w-0 w-full overflow-hidden bg-background"
              >
                <div class="mx-auto w-full min-w-0 max-w-3xl space-y-5 px-6 py-5">
                  <section class="min-w-0">
                    <p class="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                      {{ $t("quiz.question") }} {{ currentQuestionIndex }}
                    </p>
                    <div class="mt-2 font-semibold leading-7" v-html="parsedQuestion" />
                  </section>

                  <hr />

                  <section
                    class="grid min-w-0 gap-3"
                    :class="answerWasCorrect ? 'grid-cols-1' : 'md:grid-cols-2'"
                  >
                    <div
                      class="rounded-md border p-4"
                      :class="
                        answerWasCorrect
                          ? 'border-primary/50 bg-primary/5'
                          : 'border-destructive/50 bg-destructive/5'
                      "
                    >
                      <h3 class="text-sm font-semibold">{{ $t("quiz.your_answer") }}</h3>
                      <div class="mt-2 text-sm" v-html="parsedSelectedAnswer" />
                    </div>

                    <div
                      v-if="!answerWasCorrect"
                      class="rounded-md border border-primary/50 bg-primary/5 p-4"
                    >
                      <h3 class="text-sm font-semibold">{{ $t("quiz.correct_answer") }}</h3>
                      <div class="mt-2 text-sm" v-html="parsedCorrectAnswer" />
                    </div>
                  </section>

                  <section class="min-w-0">
                    <h3 class="font-semibold">{{ $t("quiz.explanation") }}</h3>
                    <div class="mt-2 text-sm leading-7" v-html="parsedExplanation" />

                    <HighlightedCodeBlock
                      v-for="codeExample in explanationCode"
                      :key="`${codeExample.language}-${codeExample.code}`"
                      class="mt-4 text-sm"
                      :language="codeExample.language"
                      :code="codeExample.code"
                    />
                  </section>
                </div>
              </ScrollArea>

              <footer class="flex border-t bg-card px-6 py-4">
                <Button
                  class="w-full sm:ml-auto sm:w-auto"
                  size="lg"
                  :disabled="isContinuing"
                  @click="continueQuiz"
                >
                  {{ $t("quiz.feedback.continue") }}
                </Button>
              </footer>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </ScrollArea>

    <!-- Controls -->
    <div class="w-full shrink-0 border-t bg-card rounded mt-2">
      <div class="mx-auto flex justify-end items-center gap-3 p-2">
        <Button
          v-if="hasCheckedAnswer && currentQuestion"
          type="button"
          size="lg"
          variant="secondary"
          @click="openFeedback"
        >
          {{ $t("quiz.feedback.view") }}
        </Button>
        <Button
          v-if="hasCheckedAnswer && currentQuestion && !feedbackOpen"
          type="button"
          size="lg"
          @click="continueQuiz"
        >
          {{ $t("quiz.feedback.continue") }}
        </Button>
        <Button
          v-if="!hasCheckedAnswer && currentQuestion"
          type="button"
          size="lg"
          :disabled="!selectedOptionId"
          @click="verifyCurrentAnswer"
        >
          {{ $t("quiz.verify_answer") }}
        </Button>
      </div>
    </div>

    <audio
      ref="correctAnswerAudio"
      aria-hidden="true"
      preload="auto"
      src="/sounds/correct-answer.mp3"
    />
    <audio
      ref="wrongAnswerAudio"
      aria-hidden="true"
      preload="auto"
      src="/sounds/wrong-answer.mp3"
    />
  </div>
</template>

<style lang="css" scoped>
@media (max-width: 767px) {
  .answer-options-scroll :deep([data-slot="scroll-area-viewport"] > div) {
    display: contents !important;
  }
}

@media (min-width: 768px) {
  .quiz-content-scroll :deep([data-slot="scroll-area-viewport"] > div) {
    display: contents !important;
  }
}
</style>
