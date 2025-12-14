<script lang="ts" setup>
import { useRoute } from "vue-router";
import useQuizGame from "~/composables/quiz/useQuizGame";
import QuizWelcome from "@/components/quiz/profile/containers/QuizWelcome.vue";
import QuizOnProgress from "@/components/quiz/profile/containers/QuizOnProgress.vue";
import QuizResults from "@/components/quiz/profile/containers/QuizResults.vue";
import QuizQuestionDetailsModal from "@/components/quiz/profile/base/QuizQuestionDetailsModal.vue";

const route = useRoute();

const  { 
  quiz,
  showDetails,
  isQuizInitialized,
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
  title: quiz.value?.title,
})

</script>

<template>
  <div class="mt-10" v-if="quiz">
    <!-- Quiz Welcome -->
    <QuizWelcome 
      v-if="!isQuizInitialized && quiz"
      :title="quiz.title"
      :description="quiz.description"
      :image="quiz.category.image.url"
      :category="quiz.category.name"
      :level="quiz.level"
      levelLabel="basico"
      @startQuiz="startQuiz()"
    />
    
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
      v-else-if="isFinished"
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
</template>

<style lang="postcss" scoped>
  
</style>
