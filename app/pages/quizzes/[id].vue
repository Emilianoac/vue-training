<script lang="ts" setup>
import { onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import useQuiz from "@/composables/useQuiz";
import QuizWelcome from "@/components/quiz/profile/containers/QuizWelcome.vue";
import QuizOnProgress from "@/components/quiz/profile/containers/QuizOnProgress.vue";
import QuizResults from "@/components/quiz/profile/containers/QuizResults.vue";
import QuizQuestionDetailsModal from "@/components/quiz/profile/base/QuizQuestionDetailsModal.vue";

const { locale } = useI18n();
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
} = useQuiz();


function updateDocumentTitle() {
  if (quiz.value) {
    document.title = `${quiz.value.title[locale.value]} - Vue Training`;
  }
}

onMounted(async () => {
  try {
    await loadQuiz(route.params.id as string );
    updateDocumentTitle();
  } catch (error) {
    console.error("Error loading quiz:", error);
  }
});

watch(() => locale.value, () => {
  updateDocumentTitle();
});
</script>

<template>
  <div class="mt-10" v-if="quiz">

    <!-- Quiz Welcome -->
    <QuizWelcome 
      v-if="!isQuizInitialized && quiz"
      :title="quiz.title[locale]"
      :description="quiz.description[locale]"
      :image="quiz.category.image"
      :category="quiz.category.name"
      :level="quiz.level"
      :levelLabel="quiz.levelLabel[locale]"
      @startQuiz="startQuiz()"
    />
    
    <!-- Quiz on Progress -->
    <QuizOnProgress 
      v-else-if="!isFinished && isQuizInitialized"
      :isFinished="isFinished"
      :isQuizInitialized="isQuizInitialized"
      :title="quiz.title[locale]"
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
