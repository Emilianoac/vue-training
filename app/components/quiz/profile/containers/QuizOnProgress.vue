<script lang="ts" setup>
import type { Question } from "@/schemas/quiz.schema";
import QuizProgress from "@/components/quiz/profile/base/QuizProgress.vue";
import QuizQuestion from "@/components/quiz/profile/base/QuizQuestion.vue";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

defineProps<{
  totalQuestions: number;
  isFinished: boolean;
  isQuizInitialized: boolean;
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
}>();
</script>

<template>
  <div class="w-full overflow-y-auto flex flex-col h-full gap-4">
    <!-- Progress -->
    <QuizProgress
      :progress="quizProgress"
      :currentQuestionIndex="currentQuestionIndex"
      :quizLength="totalQuestions"
    />

    <!-- Quiz Container -->
    <div class="bg-card border p-4 rounded-md mx-auto flex-1 overflow-hidden w-full">
      <!-- Question -->
      <QuizQuestion
        v-if="currentQuestion"
        :question="currentQuestion"
        :question-index="currentQuestionIndex"
        :checkAnswer="hasCheckedAnswer"
        :selected-option="selectedOptionId"
        @update:selected-option="emits('update:selectedOptionId', $event)"
      />
    </div>

    <!-- Controls -->
    <div class="w-full left-0 bg-card border-t rounded-md">
      <div class="mx-auto flex justify-end items-center gap-3 p-4">
        <!-- View Details button -->
        <Button
          v-if="hasCheckedAnswer && currentQuestion"
          type="button"
          size="lg"
          variant="secondary"
          @click="emits('update:showDetails', true)"
        >
          {{ $t("quiz.view_details") }}
        </Button>
        <!-- Verify Answer Button -->
        <Button
          v-if="!hasCheckedAnswer && currentQuestion"
          type="button"
          size="lg"
          :disabled="!selectedOptionId"
          @click="emits('answerCurrentQuestion')"
        >
          {{ $t("quiz.verify_answer") }}
        </Button>
        <!-- Next Question Button -->
        <Button
          v-else
          type="button"
          size="lg"
          :disabled="!selectedOptionId"
          @click="emits('goToNextQuestion')"
        >
          {{ isLastQuestion ? $t("quiz.finish_quiz") : $t("quiz.next_question") }}
        </Button>
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped></style>
