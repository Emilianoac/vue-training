<script lang="ts" setup>
import type { Question } from "@/schemas/quiz.schema";
import { CheckCircleIcon, CircleXIcon, Maximize2Icon, Minimize2Icon, XIcon } from "lucide-vue-next";
import QuizProgress from "@/components/quiz/profile/base/QuizProgress.vue";
import QuizQuestion from "@/components/quiz/profile/base/QuizQuestion.vue";
import { Button } from "@/components/ui/button";
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
const feedbackExpanded = ref(false);
const answerWasCorrect = ref(false);
const { parse } = useMarkdownParser();

const correctAnswer = computed(
  () => props.currentQuestion?.answers.find((answer) => answer.isCorrect) ?? null,
);
const parsedCorrectAnswer = computed(() => parse(correctAnswer.value?.text ?? ""));
const parsedExplanation = computed(() => parse(props.currentQuestion?.explanation ?? ""));
const explanationCode = computed(() => props.currentQuestion?.explanation_code ?? []);

function verifyCurrentAnswer() {
  const selectedAnswer = props.currentQuestion?.answers.find(
    (answer) => answer.id === props.selectedOptionId,
  );
  if (!selectedAnswer) return;

  answerWasCorrect.value = selectedAnswer.isCorrect;
  feedbackExpanded.value = false;
  emits("answerCurrentQuestion");
  feedbackOpen.value = true;

  const audio = selectedAnswer.isCorrect ? correctAnswerAudio.value : wrongAnswerAudio.value;
  if (!audio) return;

  audio.currentTime = 0;
  void audio.play().catch(() => undefined);
}

function closeFeedback() {
  feedbackOpen.value = false;
  feedbackExpanded.value = false;
}

function continueQuiz() {
  closeFeedback();
  emits("goToNextQuestion");
}

watch(
  () => props.currentQuestionIndex,
  () => {
    feedbackExpanded.value = false;
  },
);
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
            @click="feedbackOpen = true"
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

      <Teleport to="body" :disabled="!feedbackExpanded">
        <Transition
          enter-active-class="transition-opacity duration-300 ease-out"
          enter-from-class="opacity-0"
          leave-active-class="transition-opacity duration-200 ease-in"
          leave-to-class="opacity-0"
        >
          <div
            v-if="feedbackOpen"
            class="bg-background/60 backdrop-blur-[1px]"
            :class="feedbackExpanded ? 'fixed inset-0 z-40' : 'absolute inset-0 z-20'"
            aria-hidden="true"
            @click="closeFeedback"
          />
        </Transition>

        <Transition
          enter-active-class="transition-transform duration-300 ease-out"
          enter-from-class="translate-y-full"
          leave-active-class="transition-transform duration-200 ease-in"
          leave-to-class="translate-y-full"
        >
          <section
            v-show="feedbackOpen && currentQuestion && correctAnswer"
            class="flex transform-gpu flex-col overflow-hidden border bg-card shadow-2xl will-change-transform"
            :class="
              feedbackExpanded
                ? 'fixed inset-y-4 left-1/2 z-50 w-[calc(100%_-_2rem)] max-w-4xl -translate-x-1/2 rounded-xl md:inset-y-10'
                : 'absolute inset-x-0 bottom-0 z-30 h-[500px] max-h-[90%] rounded-t-xl'
            "
            role="dialog"
            aria-modal="true"
            aria-labelledby="quiz-feedback-title"
            @keydown.esc.stop="closeFeedback"
          >
            <header class="border-b px-6 py-4 text-left">
              <div class="absolute top-3 right-4 flex items-center gap-1">
                <Button
                  size="icon-sm"
                  variant="ghost"
                  :aria-label="
                    $t(feedbackExpanded ? 'quiz.feedback.restore' : 'quiz.feedback.expand')
                  "
                  :title="$t(feedbackExpanded ? 'quiz.feedback.restore' : 'quiz.feedback.expand')"
                  @click="feedbackExpanded = !feedbackExpanded"
                >
                  <Minimize2Icon v-if="feedbackExpanded" />
                  <Maximize2Icon v-else />
                </Button>
                <Button
                  size="icon-sm"
                  variant="ghost"
                  :aria-label="$t('quiz.feedback.close')"
                  :title="$t('quiz.feedback.close')"
                  @click="closeFeedback"
                >
                  <XIcon />
                </Button>
              </div>

              <div class="flex items-center gap-2 pr-20">
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
                <div class="min-w-0">
                  <h2 id="quiz-feedback-title" class="font-semibold">
                    {{
                      $t(
                        answerWasCorrect
                          ? "quiz.feedback.correctTitle"
                          : "quiz.feedback.incorrectTitle",
                      )
                    }}
                  </h2>
                </div>
              </div>
            </header>

            <ScrollArea :key="currentQuestionIndex" type="auto" class="min-h-0 flex-1">
              <div class="mx-auto max-w-3xl space-y-5 px-6 py-5">
                <section class="rounded-md border bg-muted/30 p-4">
                  <h3 class="text-sm font-semibold">{{ $t("quiz.correct_answer") }}</h3>
                  <div class="mt-2 text-sm" v-html="parsedCorrectAnswer" />
                </section>

                <section>
                  <h3 class="font-semibold">{{ $t("quiz.explanation") }}</h3>
                  <div class="mt-2 text-sm leading-6" v-html="parsedExplanation" />

                  <highlightjs
                    v-for="codeExample in explanationCode"
                    :key="`${codeExample.language}-${codeExample.code}`"
                    class="mt-4 overflow-hidden rounded-md text-sm"
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
          </section>
        </Transition>
      </Teleport>
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
