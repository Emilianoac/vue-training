<script lang="ts" setup>
import { onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useGeneralStore } from "@/stores/general";
import quizzes from "@/data/quizzes";
import useQuiz from "@/composables/useQuiz";
import QuizWelcome from "@/components/quiz/profile/QuizWelcome.vue";
import QuizProgress from "@/components/quiz/profile/QuizProgress.vue";
import QuizQuestion from "@/components/quiz/profile/QuizQuestion.vue";
import QuizResults from "@/components/quiz/profile/QuizResults.vue";
import QuizQuestionDetailsModal from "@/components/quiz/profile/QuizQuestionDetailsModal.vue";

const store = useGeneralStore();
const route = useRoute();
const router = useRouter();

const quiz = quizzes.find((quiz) => quiz.id === route.params.id);
const showModal = ref(false);

if (!quiz) router.push({ name: "NotFound" });

const  { 
  quizInit,
  quizProgress, 
  currentQuestionIndex, 
  currentQuestion, 
  selectedOption, 
  isFinished,
  isLastQuestion,
  checkAnswer,
  userHistory, 
  userStats,
  handleUserAnswer,
  handleNextQuestion,
} = useQuiz(quiz ? quiz : null);

onMounted(() => {
  if (quiz) {
    document.title = `${quiz.title[store.locale]} - Vue Training`;
  }
});

watch(() => store.locale, () => {
  if (quiz) {
    document.title = `${quiz.title[store.locale]} - Vue Training`;
  }
});
</script>

<template>
  <div class="mt-10" v-if="quiz">

    <!-- Quiz Welcome -->
    <QuizWelcome 
      v-if="!quizInit"
      :title="quiz?.title[store.locale]"
      :description="quiz?.description[store.locale]"
      :image="quiz?.category.image"
      @startQuiz="quizInit = true"
    />
    
    <!-- Quiz on Progress -->
    <div v-if="!isFinished && quizInit" class="max-w-[950px] mx-auto">
      <!-- Quiz Title -->
      <h1 class="text-xl  font-bold mb-6">{{ quiz?.title[store.locale]}}</h1>
  
      <!-- Quiz Container -->
      <div class="bg-white dark:bg-slate-900 p-4 rounded-md mx-auto"> 
        <!-- Progress -->
        <QuizProgress 
          :progress="quizProgress" 
          :currentQuestionIndex="currentQuestionIndex + 1"
          :quizLength="quiz?.questions.length"
        />

        <!-- Question -->
        <QuizQuestion 
          :question="currentQuestion" 
          :checkAnswer="checkAnswer"
          v-model="selectedOption"
        />

        <!-- Controls -->
        <div class="flex justify-end items-center gap-3 mt-6">
          <!-- View Details button -->
          <button v-if="checkAnswer" 
            @click="showModal = true"
            class="app-button secondary text-sm">
            {{ $t('quiz.view_details') }}
          </button>
          <!-- Verify Answer Button -->
          <button 
            v-if="!checkAnswer"
            :disabled="!selectedOption"
            class="app-button primary text-sm" 
            @click="handleUserAnswer">
            {{ $t('quiz.verify_answer') }}
          </button>
          <!-- Next Question Button -->
          <button 
            v-else
            :disabled="!selectedOption"
            class="app-button primary text-sm"
            @click="handleNextQuestion">
            {{ isLastQuestion ? $t('quiz.finish_quiz') : $t('quiz.next_question') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Quiz Results -->
     <QuizResults 
      v-else-if="isFinished"
      :userHistory="userHistory"
      :userStats="userStats"
      :quiz="quiz"
    />
  </div>

  <Teleport to="body">
    <QuizQuestionDetailsModal 
      v-if="showModal"
      :question="currentQuestion"
      @close-modal="showModal = false"
    />
  </Teleport>
</template>

<style lang="postcss" scoped>
  
</style>
