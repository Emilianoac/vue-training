<script lang="ts" setup>
import { useRoute } from "vue-router";
import useQuizGame from "~/composables/quiz/useQuizGame";
import QuizWelcome from "@/components/quiz/profile/containers/QuizWelcome.vue";
import QuizOnProgress from "@/components/quiz/profile/containers/QuizOnProgress.vue";
import QuizResults from "@/components/quiz/profile/containers/QuizResults.vue";
import QuizOnLoading from "@/components/quiz/profile/containers/QuizOnLoading.vue";
import QuizQuestionDetailsModal from "@/components/quiz/profile/base/QuizQuestionDetailsModal.vue";

definePageMeta({
  layout: false 
})

const { locale } = useI18n();
const route = useRoute();

const  { 
  quiz,
  showDetails,
  isQuizInitialized,
  isQuizLoading,
  hasCheckedAnswer,
  selectedOptionId,
  quizProgress, 
  currentQuestionIndex, 
  currentQuestion, 
  isFinished,
  isLastQuestion,
  userHistory, 
  userStats,
  elapsedTime,

  startQuiz,
  resetQuizState,
  goToNextQuestion,
  loadQuiz,
  answerCurrentQuestion
} = useQuizGame();

await loadQuiz(route.params.id as string );

useSeoMeta({
  title: computed(() => quiz.value?.title)
})

const currentLayout = computed(() => {
  if (isQuizInitialized.value || isFinished.value) {
    return "blank";
  }
  return "default";
})

watch(() => locale.value, async () => {
  await loadQuiz(route.params.id as string);
})

</script>

<template>
  <NuxtLayout :name="currentLayout">
    <div class="mt-10" v-if="quiz">
      <!-- Quiz Welcome -->
      <QuizWelcome 
        v-if="!isQuizInitialized && quiz"
        :title="quiz.title"
        :description="quiz.description"
        :image="quiz.category.image.url"
        :category="quiz.category.name"
        :level="quiz.level"
        @startQuiz="startQuiz()"
      />

      <!-- Quiz Loading -->
      <QuizOnLoading v-else-if="isQuizInitialized && isQuizLoading"/>
      
      <!-- Quiz on Progress -->
      <QuizOnProgress 
        v-else-if="!isFinished && isQuizInitialized"
        :isFinished="isFinished"
        :isQuizInitialized="isQuizInitialized"
        :title="quiz.title"
        :quizProgress="quizProgress"
        :currentQuestionIndex="currentQuestionIndex"  
        :currentQuestion="currentQuestion"
        :quiz="quiz"
        :selectedOptionId="selectedOptionId"
        :hasCheckedAnswer="hasCheckedAnswer"
        :isLastQuestion="isLastQuestion"
        @update:showDetails="(value: boolean) => showDetails = value"
        @answerCurrentQuestion="answerCurrentQuestion()"
        @goToNextQuestion="goToNextQuestion()"
        @update:selectedOptionId="(value: number | null) => selectedOptionId = value"
      />
  
      <!-- Quiz Results -->
      <QuizResults
        v-else
        :elapsed-time="elapsedTime"
        :userHistory="userHistory"
        :userStats="userStats"
        :quiz="quiz"
        @resetQuiz="resetQuizState()"
      />
    </div>
  
    <Teleport to="body">
      <QuizQuestionDetailsModal 
        v-if="showDetails && currentQuestion"
        :question="currentQuestion"
        @close-modal="showDetails = false"
      />
    </Teleport>
  </NuxtLayout>
</template>

<style scoped>
/* Duración y curva de la animación */
.loading-fade-enter-active,
.loading-fade-leave-active {
  transition: all 0.3s ease-in-out;
}

/* Estado invisible (al empezar a entrar y al terminar de salir) */
.loading-fade-enter-from,
.loading-fade-leave-to {
  opacity: 0;
  transform: scale(0.95); /* Un pequeño zoom out */
}

/* Estado visible (opcional, por defecto es 1) */
.loading-fade-enter-to,
.loading-fade-leave-from {
  opacity: 1;
  transform: scale(1);
}
</style>