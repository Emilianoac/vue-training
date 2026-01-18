<script setup lang="ts">
import { useRoute } from "vue-router";
import useQuizGame from "~/composables/quiz/useQuizGame";

import QuizWelcome from "@/components/quiz/profile/containers/QuizWelcome.vue";
import QuizOnProgress from "@/components/quiz/profile/containers/QuizOnProgress.vue";
import QuizResults from "@/components/quiz/profile/containers/QuizResults.vue";
import QuizOnLoading from "@/components/quiz/profile/containers/QuizOnLoading.vue";
import QuizQuestionDetailsModal from "@/components/quiz/profile/base/QuizQuestionDetailsModal.vue";

definePageMeta({
  layout: false,
});

const route = useRoute();
const { locale } = useI18n();

const showQuestionDetails = ref(false);

const {
  quiz,

  state,
  
  totalQuestions,
  displayQuestionIndex,
  currentQuestion,
  isLastQuestion,
  elapsedTime,

  actions
} = useQuizGame();


await actions.loadQuiz(route.params.id as string);

useSeoMeta({
  title: computed(() => quiz.value?.title),
});

const currentLayout = computed(() => {
  if (state.quizState.isInitialized || state.quizState.isFinished) {
    return "blank";
  }
  return "default";
});

watch(() => locale.value,
  async () => {
    await actions.loadQuiz(route.params.id as string);
  }
);
</script>

<template>
  <NuxtLayout :name="currentLayout">
    <div class="mt-10" v-if="quiz">
      <!-- Welcome -->
      <QuizWelcome
        v-if="!state.quizState.isInitialized"
        :title="quiz.title"
        :description="quiz.description"
        :image="quiz.category.image.url"
        :category="quiz.category.name"
        :level="quiz.level"
        :number-of-questions="totalQuestions"
        @startQuiz="actions.startQuiz()"
      />

      <!-- Loading -->
      <QuizOnLoading v-else-if="state.quizState.isInitialized && state.quizState.isLoading"/>

      <!-- On progress -->
      <QuizOnProgress
        v-else-if="state.quizState.isInitialized && !state.quizState.isFinished"
        :title="quiz.title"
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
        @leave-quiz="(message) => actions.leaveQuiz(message)"
      />

      <!-- Results -->
      <QuizResults
        v-else
        :title="quiz.title"
        :elapsed-time="elapsedTime"
        :userHistory="state.result.history"
        :userStats="state.result.stats"
        @leave-quiz="(message) => actions.leaveQuiz(message)"
        @resetQuiz="actions.resetQuizState()"
      />
    </div>

    <Teleport to="body">
      <QuizQuestionDetailsModal
        v-if="showQuestionDetails && currentQuestion"
        :question="currentQuestion"
        @close-modal="showQuestionDetails = false"
      />
    </Teleport>
  </NuxtLayout>
</template>

<style lang="postcss" scoped></style>