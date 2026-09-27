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

type QuizStage = "welcome" | "loading" | "ongoing" | "results";

const quizStage = computed<QuizStage>(() => {
  if (!state.quizState.isInitialized) return "welcome";
  if (state.quizState.isLoading) return "loading";
  if (!state.quizState.isFinished) return "ongoing";

  return "results";
});

const activityContentClasses = {
  welcome: "p-4",
  loading: "",
  ongoing: "p-4",
  results: "p-4 pr-0",
} satisfies Record<QuizStage, string>;

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
    :content-class="activityContentClasses[quizStage]"
  >
    <!-- Welcome -->
    <div v-if="quizStage === 'welcome'" class="flex h-full min-h-0 items-center">
      <QuizWelcome
        class="mx-auto max-h-full max-w-full lg:max-w-[90%]"
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
    </div>

    <!-- Loading -->
    <QuizOnLoading v-else-if="quizStage === 'loading'" />

    <!-- On progress -->
    <div v-else-if="quizStage === 'ongoing'" class="flex h-full min-h-0 items-center">
      <QuizOnProgress
        class="mx-auto max-h-full max-w-[1000px]"
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
