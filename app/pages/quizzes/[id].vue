<script setup lang="ts">
import { useRoute } from "vue-router";
import useQuizGame from "~/composables/quiz/useQuizGame";

import QuizWelcome from "@/components/quiz/profile/containers/QuizWelcome.vue";
import QuizOnProgress from "@/components/quiz/profile/containers/QuizOnProgress.vue";
import QuizResults from "@/components/quiz/profile/containers/QuizResults.vue";
import QuizOnLoading from "@/components/quiz/profile/containers/QuizOnLoading.vue";

definePageMeta({
  layout: "activity",
});

const route = useRoute();
const { locale } = useI18n();

const {
  quiz,

  state,

  totalQuestions,
  displayQuestionIndex,
  currentQuestion,
  elapsedTime,

  actions,
} = useQuizGame();

await actions.loadQuiz(route.params.id as string);

useSeoMeta({
  title: computed(() => quiz.value?.title),
});

watch(
  () => locale.value,
  async () => {
    await actions.loadQuiz(route.params.id as string);
  },
);
</script>

<template>
  <ActivityShell
    v-if="quiz"
    :title="quiz.title"
    back-to="/learn/quizzes"
    class="lg:max-w-full"
    content-class="p-4 flex-initial"
  >
    <!-- Welcome -->
    <QuizWelcome
      v-if="!state.quizState.isInitialized"
      class="max-w-full lg:max-w-[90%] mx-auto"
      :title="quiz.title"
      :description="quiz.description"
      :image="quiz.subCategory.image.url"
      :category="
        quiz.subCategory ? quiz.category.name + ' - ' + quiz.subCategory.name : quiz.category.name
      "
      :level="quiz.level"
      :number-of-questions="totalQuestions"
      @startQuiz="actions.startQuiz()"
    />

    <!-- Loading -->
    <QuizOnLoading v-else-if="state.quizState.isInitialized && state.quizState.isLoading" />

    <!-- On progress -->
    <QuizOnProgress
      v-else-if="state.quizState.isInitialized && !state.quizState.isFinished"
      class="max-w-[1000px] mx-auto"
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

    <!-- Results -->
    <QuizResults
      v-else
      class="max-w-[1000px] mx-auto"
      :elapsed-time="elapsedTime"
      :userHistory="state.result.history"
      :userStats="state.result.stats"
      @resetQuiz="actions.resetQuizState()"
    />
  </ActivityShell>
</template>

<style lang="postcss" scoped></style>
