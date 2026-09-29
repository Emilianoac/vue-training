<script setup lang="ts">
import { CheckCircleIcon, CircleXIcon } from "lucide-vue-next";
import useQuizGame from "~/composables/quiz/useQuizGame";
import {
  hasPassedLearningPathQuiz,
  LEARNING_PATH_QUIZ_PASS_PERCENTAGE,
} from "@/domain/quiz/learningPathQuizCompletion";
import { useLearningPathProgress } from "@/composables/learning-path/useLearningPathProgress";
import { getLearningPathReturnPath } from "@/composables/learning-path/useLearningPathNavigation";
import useQuizAmbientMusic, { type QuizStage } from "@/composables/quiz/useQuizAmbientMusic";
import useQuizButtonClickSound from "@/composables/quiz/useQuizButtonClickSound";
import useQuizCharacterSound from "@/composables/quiz/useQuizCharacterSound";
import QuizWelcome from "@/components/quiz/player/stages/welcome/QuizWelcome.vue";
import QuizOnProgress from "@/components/quiz/player/stages/ongoing/QuizOnProgress.vue";
import QuizResults from "@/components/quiz/player/stages/results/QuizResults.vue";
import QuizOnLoading from "@/components/quiz/player/stages/loading/QuizOnLoading.vue";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

definePageMeta({
  layout: "activity",
});

const route = useRoute();
const router = useRouter();
const { locale, t } = useI18n();

const pathId = route.params.pathId as string;
const quizId = route.params.id as string;
const completionDialogOpen = ref(false);
const hasCompleted = ref(false);
const { markComplete } = useLearningPathProgress();
const learningPathReturnPath = getLearningPathReturnPath();
useQuizButtonClickSound();
const { primeCharacterSound } = useQuizCharacterSound();

const { quiz, state, totalQuestions, displayQuestionIndex, currentQuestion, elapsedTime, actions } =
  useQuizGame();
const hasPassed = computed(() => hasPassedLearningPathQuiz(state.result.stats.percentage));

const quizStage = computed<QuizStage>(() => {
  if (!state.quizState.isInitialized) return "welcome";
  if (state.quizState.isLoading) return "loading";
  if (!state.quizState.isFinished) return "ongoing";

  return "results";
});

useQuizAmbientMusic(quizStage);

const activityContentClasses = {
  welcome: "p-4",
  loading: "",
  ongoing: "p-4",
  results: "p-4 pr-0",
} satisfies Record<QuizStage, string>;

await actions.loadQuiz(quizId);

useSeoMeta({
  title: computed(() => quiz.value?.title),
});

watch(
  () => locale.value,
  async () => {
    await actions.loadQuiz(quizId);
  },
);

watch(
  () => state.quizState.isFinished,
  (isFinished) => {
    if (isFinished) {
      handleQuizCompleted();
    }
  },
);

function handleQuizCompleted() {
  completionDialogOpen.value = true;

  if (hasPassed.value && !hasCompleted.value) {
    hasCompleted.value = true;
    markComplete(pathId, "quiz", quizId);
  }
}

function continueToLearningPath() {
  router.push(learningPathReturnPath);
}

function startQuiz() {
  primeCharacterSound();
  actions.startQuiz();
}
</script>

<template>
  <ActivityShell
    v-if="quiz"
    data-quiz-sound-scope
    :title="quiz.title"
    :back-to="learningPathReturnPath"
    :content-class="activityContentClasses[quizStage]"
  >
    <div v-if="quizStage === 'welcome'" class="flex h-full min-h-0 items-center">
      <QuizWelcome
        class="mx-auto max-h-full max-w-full lg:max-w-[90%]"
        :title="quiz.title"
        :description="quiz.description"
        :image="quiz.subCategory.image.url"
        :category="quiz.category.name"
        :level="quiz.level"
        :number-of-questions="totalQuestions"
        :required-percentage="LEARNING_PATH_QUIZ_PASS_PERCENTAGE"
        @startQuiz="startQuiz"
      />
    </div>

    <QuizOnLoading v-else-if="quizStage === 'loading'" />

    <div v-else-if="quizStage === 'ongoing'" class="flex h-full min-h-0 items-center">
      <QuizOnProgress
        class="mx-auto max-h-full max-w-[1200px]"
        :total-questions="totalQuestions"
        :currentQuestion="currentQuestion"
        :quizProgress="state.progress.percentage"
        :currentQuestionIndex="displayQuestionIndex"
        :selectedOptionId="state.answer.selectedOptionId"
        :hasCheckedAnswer="state.answer.hasCheckedAnswer"
        @update:selectedOptionId="state.answer.selectedOptionId = $event"
        @answerCurrentQuestion="actions.answerCurrentQuestion()"
        @goToNextQuestion="actions.goToNextQuestion()"
      />
    </div>

    <template v-else>
      <QuizResults
        class="max-w-[1000px] mx-auto"
        :elapsed-time="elapsedTime"
        :required-percentage="LEARNING_PATH_QUIZ_PASS_PERCENTAGE"
        :userHistory="state.result.history"
        :userStats="state.result.stats"
        @resetQuiz="actions.resetQuizState()"
      />
    </template>
  </ActivityShell>

  <Dialog v-model:open="completionDialogOpen">
    <DialogContent>
      <DialogHeader>
        <div
          class="mb-2 flex size-11 items-center justify-center rounded-full"
          :class="hasPassed ? 'bg-primary/10 text-primary' : 'bg-destructive/10 text-destructive'"
        >
          <CheckCircleIcon v-if="hasPassed" class="size-6" />
          <CircleXIcon v-else class="size-6" />
        </div>
        <DialogTitle>
          {{ t(hasPassed ? "quiz.completion.title" : "quiz.completion.failedTitle") }}
        </DialogTitle>
        <DialogDescription>
          {{
            t(hasPassed ? "quiz.completion.message" : "quiz.completion.failedMessage", {
              percentage: LEARNING_PATH_QUIZ_PASS_PERCENTAGE,
            })
          }}
        </DialogDescription>
      </DialogHeader>

      <DialogFooter>
        <Button @click="continueToLearningPath">
          {{ t("quiz.completion.continueLearningPath") }}
        </Button>
        <DialogClose as-child>
          <Button variant="outline">
            {{ t("quiz.completion.close") }}
          </Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
