<script lang="ts" setup>
import { onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { useGeneralStore } from "@/stores/general";
import useQuiz from "@/composables/useQuiz";
import QuizWelcome from "@/components/quiz/profile/QuizWelcome.vue";
import QuizProgress from "@/components/quiz/profile/QuizProgress.vue";
import QuizQuestion from "@/components/quiz/profile/QuizQuestion.vue";
import QuizResults from "@/components/quiz/profile/QuizResults.vue";
import QuizQuestionDetailsModal from "@/components/quiz/profile/QuizQuestionDetailsModal.vue";

const store = useGeneralStore();
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
    document.title = `${quiz.value.title[store.locale]} - Vue Training`;
  }
}

onMounted(async () => {
  await loadQuiz(route.params.id as string );
  updateDocumentTitle();
});

watch(() => store.locale, () => {
  updateDocumentTitle();
});
</script>

<template>
  <div class="mt-10" v-if="quiz">

    <!-- Quiz Welcome -->
    <QuizWelcome 
      v-if="!isQuizInitialized && quiz"
      :title="quiz.title[store.locale]"
      :description="quiz.description[store.locale]"
      :image="quiz.category.image"
      :category="quiz.category.name"
      :level="quiz.level"
      :levelLabel="quiz.levelLabel[store.locale]"
      @startQuiz="startQuiz()"
    />
    
    <!-- Quiz on Progress -->
    <div v-if="!isFinished && isQuizInitialized" class="max-w-[950px] mx-auto">
      <!-- Quiz Title -->
      <h1 class="text-xl  font-bold mb-6">{{ quiz?.title[store.locale]}}</h1>
  
      <!-- Quiz Container -->
      <div class="bg-white dark:bg-slate-800/50 border dark:border-slate-800 border-slate-200  p-4 rounded-md mx-auto"> 
        <!-- Progress -->
        <QuizProgress 
          :progress="quizProgress" 
          :currentQuestionIndex="currentQuestionIndex + 1"
          :quizLength="quiz?.questions.length"
        />

        <!-- Question -->
        <QuizQuestion v-if="currentQuestion"
          :question="currentQuestion" 
          :checkAnswer="hasCheckedAnswer"
          v-model="selectedOptionId"
        />

        <!-- Controls -->
        <div class="flex justify-end items-center gap-3 mt-6">
          <!-- View Details button -->
          <button v-if="hasCheckedAnswer && currentQuestion" 
            @click="showDetails = true"
            class="app-button secondary text-sm">
            {{ $t('quiz.view_details') }}
          </button>
          <!-- Verify Answer Button -->
          <button 
            v-if="!hasCheckedAnswer && currentQuestion"
            :disabled="!selectedOptionId"
            class="app-button primary text-sm" 
            @click="answerCurrentQuestion">
            {{ $t('quiz.verify_answer') }}
          </button>
          <!-- Next Question Button -->
          <button 
            v-else
            :disabled="!selectedOptionId"
            class="app-button primary text-sm"
            @click="goToNextQuestion">
            {{ isLastQuestion ? $t('quiz.finish_quiz') : $t('quiz.next_question') }}
          </button>
        </div>
      </div>
    </div>

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
