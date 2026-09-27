<script lang="ts" setup>
import type { Question } from "@/schemas/quiz.schema";
import { CheckCircleIcon, CircleXIcon, XIcon } from "lucide-vue-next";
import HighlightedCodeBlock from "@/components/content/HighlightedCodeBlock.vue";
import QuizProgress from "@/components/quiz/profile/base/QuizProgress.vue";
import QuizQuestion from "@/components/quiz/profile/base/QuizQuestion.vue";
import { Button } from "@/components/ui/button";
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
const { parse } = useMarkdownParser();

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

  const audio = selectedAnswer.isCorrect ? correctAnswerAudio.value : wrongAnswerAudio.value;
  if (!audio) return;

  audio.currentTime = 0;
  void audio.play().catch(() => undefined);
}

function openFeedback() {
  feedbackViewKey.value += 1;
  feedbackOpen.value = true;
}

function closeFeedback() {
  feedbackOpen.value = false;
}

function continueQuiz() {
  closeFeedback();
  emits("goToNextQuestion");
}
</script>

<template>
  <div
    class="quiz-on-progress relative flex h-full max-h-full w-full flex-col gap-4 overflow-hidden"
  >
    <!-- Progress -->
    <QuizProgress
      :progress="quizProgress"
      :currentQuestionIndex="currentQuestionIndex"
      :quizLength="totalQuestions"
    />

    <div class="relative flex min-h-0 flex-auto flex-col overflow-hidden rounded-md border bg-card">
      <!-- Quiz Container -->
      <div class="mx-auto min-h-0 w-full flex-auto overflow-hidden p-4">
        <!-- Question -->
        <QuizQuestion
          v-if="currentQuestion"
          :question="currentQuestion"
          :question-index="currentQuestionIndex"
          :checkAnswer="hasCheckedAnswer"
          :selected-option="selectedOptionId"
          @update:selected-option="emits('update:selectedOptionId', $event)"
        />
      </div>

      <!-- Controls -->
      <div class="w-full shrink-0 border-t bg-card">
        <div class="mx-auto flex justify-end items-center gap-3 p-4">
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

      <Dialog v-model:open="feedbackOpen">
        <DialogContent
          v-if="currentQuestion && selectedAnswer && correctAnswer"
          :show-close-button="false"
          class="grid h-[calc(100%_-_2rem)] grid-rows-[auto_minmax(0,1fr)_auto] gap-0 overflow-hidden rounded-xl bg-card p-0 sm:max-w-4xl md:h-[calc(100%_-_5rem)]"
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
            class="min-h-0 bg-background"
          >
            <div class="mx-auto max-w-3xl space-y-5 px-6 py-5">
              <section>
                <p class="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                  {{ $t("quiz.question") }} {{ currentQuestionIndex + 1 }}
                </p>
                <div class="mt-2 font-semibold leading-7" v-html="parsedQuestion" />
              </section>

              <hr />

              <section
                class="grid gap-3"
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

              <section>
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
            <Button class="w-full sm:ml-auto sm:w-auto" size="lg" @click="continueQuiz">
              {{ $t("quiz.feedback.continue") }}
            </Button>
          </footer>
        </DialogContent>
      </Dialog>
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
@media (min-width: 768px) and (min-height: 700px) {
  .quiz-on-progress {
    height: fit-content;
  }
}
</style>
