<script setup lang="ts">
import { useRoute } from "vue-router";
import useQuizGame from "~/composables/quiz/useQuizGame";
import useQuizAmbientMusic, { type QuizStage } from "@/composables/quiz/useQuizAmbientMusic";
import useQuizButtonClickSound from "@/composables/quiz/useQuizButtonClickSound";
import useQuizCharacterSound from "@/composables/quiz/useQuizCharacterSound";
import { getQuizOutcome, QUIZ_PASS_PERCENTAGE } from "@/domain/quiz/getQuizOutcome";

import QuizWelcome from "@/components/quiz/player/stages/welcome/QuizWelcome.vue";
import QuizOnProgress from "@/components/quiz/player/stages/ongoing/QuizOnProgress.vue";
import QuizResults from "@/components/quiz/player/stages/results/QuizResults.vue";
import QuizCompletionDialog from "@/components/quiz/player/stages/results/QuizCompletionDialog.vue";
import QuizOnLoading from "@/components/quiz/player/stages/loading/QuizOnLoading.vue";

definePageMeta({
  layout: "activity",
});

const route = useRoute();
const { locale } = useI18n();
const completionDialogOpen = ref(false);
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
const outcome = computed(() => getQuizOutcome(state.result.stats.percentage));

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

watch(
  () => state.quizState.isFinished,
  (isFinished) => {
    if (isFinished) completionDialogOpen.value = true;
  },
);

function startQuiz() {
  primeCharacterSound();
  actions.startQuiz();
}

function retryQuiz() {
  actions.resetQuizState();
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
        :required-percentage="QUIZ_PASS_PERCENTAGE"
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
        :has-used-evan-you-call="state.lifeline.hasUsedEvanYouCall"
        :pending-eliminated-option-ids="state.lifeline.pendingEliminatedOptionIds"
        :eliminated-option-ids="state.lifeline.eliminatedOptionIds"
        @update:selectedOptionId="state.answer.selectedOptionId = $event"
        @answerCurrentQuestion="actions.answerCurrentQuestion()"
        @goToNextQuestion="actions.goToNextQuestion()"
        @callEvanYou="actions.callEvanYou()"
        @applyEvanYouCall="actions.applyEvanYouCall()"
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

  <QuizCompletionDialog
    v-model:open="completionDialogOpen"
    :outcome="outcome"
    :percentage="state.result.stats.percentage"
    :required-percentage="QUIZ_PASS_PERCENTAGE"
    mode="standalone"
    @primary-action="retryQuiz"
  />
</template>

<style lang="postcss" scoped></style>
