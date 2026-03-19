<script lang="ts" setup>
import QuizCard from "@/components/quiz/QuizCard.vue";
import type { QuizListItem } from "@/schemas/quiz.schema";

defineProps<{
  quizzes: QuizListItem[];
}>();

</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
    <QuizCard 
      v-for="quiz in quizzes" 
      :quiz="quiz" 
    />
  </div>
</template>

<style lang="postcss" scoped>
  
</style>
