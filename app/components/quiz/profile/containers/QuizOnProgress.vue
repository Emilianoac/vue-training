<script lang="ts" setup>
  import type { Question } from "@/types/quiz";

  import QuizProgress from "@/components/quiz/profile/base/QuizProgress.vue"
  import QuizQuestion from "@/components/quiz/profile/base/QuizQuestion.vue";
  import BaseButton from "@/components/ui/BaseButton.vue";

  defineProps<{
    totalQuestions: number,
    isFinished: boolean;
    isQuizInitialized: boolean;
    title: string;
    quizProgress: number;
    currentQuestionIndex: number;
    currentQuestion: Question | null;
    hasCheckedAnswer: boolean;
    selectedOptionId: string | null;
    isLastQuestion: boolean;
  }>();


  const emits = defineEmits<{
    (e: "update:showDetails", value: boolean): void;
    (e: "answerCurrentQuestion"): void;
    (e: "goToNextQuestion"): void;
    (e: "update:selectedOptionId", value: string | null): void;
    (e: "leaveQuiz", value: string): void
  }>();

</script>

<template>
  <div>
    <!-- Quiz on Progress -->
    <div>
      <div class="flex justify-between items-center">
        <!-- Quiz Title -->
        <h1 class="text-xl  font-bold mb-6">{{ title }}</h1>
        <button 
          class="hover:opacity-30"
          :title="$t('quiz.leave_quiz')"
          @click="emits('leaveQuiz', $t('quiz.leave_quiz_confirm'))">
            <Icon name="mdi:close" :size="20"/>
        </button>
      </div>
  
      <!-- Progress -->
      <QuizProgress 
        :progress="quizProgress" 
        :currentQuestionIndex="currentQuestionIndex"
        :quizLength="totalQuestions"
      />
  
      <!-- Quiz Container -->
      <div class="bg-white dark:bg-slate-800/50 border dark:border-slate-800 border-slate-200  p-4 rounded-md mx-auto">
         
        <!-- Question -->
        <QuizQuestion v-if="currentQuestion"
          :question="currentQuestion" 
          :question-index="currentQuestionIndex"
          :checkAnswer="hasCheckedAnswer"
          :model-value="selectedOptionId"
          @update:model-value="emits('update:selectedOptionId', $event)"
        />
      </div>
    </div>
  
    <!-- Controls -->
    <div class="fixed lg:relative bottom-0 w-full left-0 bg-slate-100 dark:bg-slate-800 dark:lg:bg-transparent lg:bg-transparent rounded-md mt-4 z-[999]">
      <div class="container mx-auto flex justify-end items-center gap-3 lg:p-0 p-4">
        <!-- View Details button -->
        <BaseButton 
          v-if="hasCheckedAnswer && currentQuestion" 
          type="button"
          variant="secondary"
          @click="emits('update:showDetails', true)"
          class="app-button secondary text-sm">
          {{ $t('quiz.view_details') }}
        </BaseButton>
        <!-- Verify Answer Button -->
        <BaseButton
          v-if="!hasCheckedAnswer && currentQuestion"
          type="button"
          :disabled="!selectedOptionId"
          class="app-button primary text-sm" 
          @click="emits('answerCurrentQuestion')">
          {{ $t('quiz.verify_answer') }}
        </BaseButton>
        <!-- Next Question Button -->
        <BaseButton
          v-else
          type="button"
          :disabled="!selectedOptionId"
          class="app-button primary text-sm"
          @click="emits('goToNextQuestion')">
          {{ isLastQuestion ? $t('quiz.finish_quiz') : $t('quiz.next_question') }}
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
  
</style>
