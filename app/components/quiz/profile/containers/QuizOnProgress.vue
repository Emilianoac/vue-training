<script lang="ts" setup>
  import type { Quiz, Question } from "@/types/quiz";

  import QuizProgress from "@/components/quiz/profile/base/QuizProgress.vue"
  import QuizQuestion from "@/components/quiz/profile/base/QuizQuestion.vue";
  import BaseButton from "@/components/ui/BaseButton.vue";

  defineProps<{
    isFinished: boolean;
    isQuizInitialized: boolean;
    title: string;
    quizProgress: number;
    currentQuestionIndex: number;
    currentQuestion: Question | null;
    quiz: Quiz;
    hasCheckedAnswer: boolean;
    selectedOptionId: number | null;
    isLastQuestion: boolean;
  }>();

  const selectedOptionId = defineModel<number | null>('selectedOptionId');

  const emits = defineEmits<{
    (e: "update:showDetails", value: boolean): void;
    (e: "answerCurrentQuestion"): void;
    (e: "goToNextQuestion"): void;
    (e: "update:selectedOptionId", value: number | null): void; // 👈 para reemitir
  }>();
</script>

<template>
  <!-- Quiz on Progress -->
  <div class="max-w-[950px] mx-auto">
    <!-- Quiz Title -->
    <h1 class="text-xl  font-bold mb-6">{{ title }}</h1>

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
        :question-index="currentQuestionIndex"
        :checkAnswer="hasCheckedAnswer"
        :model-value="selectedOptionId"
        @update:model-value="emits('update:selectedOptionId', $event)"
      />

      <!-- Controls -->
      <div class="flex justify-end items-center gap-3 mt-6">
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
