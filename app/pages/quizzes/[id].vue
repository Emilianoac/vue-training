<script setup lang="ts">
import { useRoute } from "vue-router";
import useQuizGame from "~/composables/quiz/useQuizGame";
import useQuizAmbientMusic, { type QuizStage } from "@/composables/quiz/useQuizAmbientMusic";
import useQuizButtonClickSound from "@/composables/quiz/useQuizButtonClickSound";
import useQuizCharacterSound from "@/composables/quiz/useQuizCharacterSound";

import QuizWelcome from "@/components/quiz/player/views/QuizWelcome.vue";
import QuizOnProgress from "@/components/quiz/player/views/QuizOnProgress.vue";
import QuizResults from "@/components/quiz/player/views/QuizResults.vue";
import QuizOnLoading from "@/components/quiz/player/views/QuizOnLoading.vue";

definePageMeta({
  layout: "activity",
});

const route = useRoute();
const { locale } = useI18n();
useQuizButtonClickSound();
const { primeCharacterSound } = useQuizCharacterSound();

const {
  quiz,

  state,

  totalQuestions,
  displayQuestionIndex,
  currentQuestion,
  elapsedTime,

  actions,
} = useQuizGame();

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
        @startQuiz="startQuiz"
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
