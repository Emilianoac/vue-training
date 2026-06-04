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
  <ScrollArea class="h-full pr-2 w-full">
    <div class="w-full overflow-y-auto">
      <!-- Progress -->
      <QuizProgress
        :progress="quizProgress"
        :currentQuestionIndex="currentQuestionIndex"
        :quizLength="totalQuestions"
      />

      <!-- Quiz Container -->
      <div class="bg-card border p-4 mb-15 rounded-md mx-auto">
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
      <div class="fixed bottom-0 w-full left-0 bg-card border-t rounded-md mt-4 z-999">
        <div class="mx-auto flex justify-end items-center gap-3 px-4 py-3 lg:px-0 max-w-[1000px]">
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
  </ScrollArea>
</template>

<style lang="postcss" scoped></style>
