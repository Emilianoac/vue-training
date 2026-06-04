<script setup lang="ts">
import useQuizGame from "~/composables/quiz/useQuizGame";
import { useLearningPathProgress } from "@/composables/learning-path/useLearningPathProgress";
import QuizWelcome from "@/components/quiz/profile/containers/QuizWelcome.vue";
import QuizOnProgress from "@/components/quiz/profile/containers/QuizOnProgress.vue";
import QuizResults from "@/components/quiz/profile/containers/QuizResults.vue";
import QuizOnLoading from "@/components/quiz/profile/containers/QuizOnLoading.vue";
import QuizQuestionDetailsModal from "@/components/quiz/profile/base/QuizQuestionDetailsModal.vue";

definePageMeta({
  layout: false,
});

const route = useRoute();
const router = useRouter();
const { locale } = useI18n();

const pathId = route.params.pathId as string;
const quizId = route.params.id as string;
const showQuestionDetails = ref(false);
const { markComplete } = useLearningPathProgress();

const {
  quiz,
  state,
  totalQuestions,
  displayQuestionIndex,
  currentQuestion,
  currentCorrectAnswer,
  isLastQuestion,
  elapsedTime,
  actions,
} = useQuizGame();

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

function markCompleteAndReturn() {
  markComplete(pathId, "quiz", quizId);
  router.push("/learn/learning-paths");
}
</script>

<template>
  <NuxtLayout name="activity">
    <ActivityShell
      v-if="quiz"
      :title="quiz.title"
      back-to="/learn/learning-paths"
      content-class="p-4 flex-initial"
    >
      <QuizWelcome
        v-if="!state.quizState.isInitialized"
        class="max-w-full lg:max-w-[90%] mx-auto"
        :title="quiz.title"
        :description="quiz.description"
        :image="quiz.category.image.url"
        :category="quiz.category.name"
        :level="quiz.level"
        :number-of-questions="totalQuestions"
        @startQuiz="actions.startQuiz()"
      />

      <QuizOnLoading v-else-if="state.quizState.isInitialized && state.quizState.isLoading" />

      <QuizOnProgress
        v-else-if="state.quizState.isInitialized && !state.quizState.isFinished"
        class="max-w-[1000px] mx-auto"
        :total-questions="totalQuestions"
        :currentQuestion="currentQuestion"
        :quizProgress="state.progress.percentage"
        :currentQuestionIndex="displayQuestionIndex"
        :selectedOptionId="state.answer.selectedOptionId"
        :hasCheckedAnswer="state.answer.hasCheckedAnswer"
        :isLastQuestion="isLastQuestion"
        :is-finished="state.quizState.isFinished"
        :is-quiz-initialized="state.quizState.isInitialized"
        @update:showDetails="showQuestionDetails = $event"
        @update:selectedOptionId="state.answer.selectedOptionId = $event"
        @answerCurrentQuestion="actions.answerCurrentQuestion()"
        @goToNextQuestion="actions.goToNextQuestion()"
      />

      <template v-else>
        <QuizResults
          class="max-w-[1000px] mx-auto"
          :elapsed-time="elapsedTime"
          :userHistory="state.result.history"
          :userStats="state.result.stats"
          @resetQuiz="actions.resetQuizState()"
        />
      </template>
    </ActivityShell>

    <Teleport to="body">
      <QuizQuestionDetailsModal
        v-if="showQuestionDetails && currentQuestion && currentCorrectAnswer"
        :question-text="currentQuestion.text"
        :code-examples="currentQuestion.explanation_code"
        :explanation="currentQuestion.explanation"
        :correct-answer="currentCorrectAnswer.text"
        @close-modal="showQuestionDetails = false"
      />
    </Teleport>
  </NuxtLayout>
</template>
