<script lang="ts" setup>
import CardComponent from "@/components/CardComponent.vue";
import type { Quiz } from "@/types/quiz";

defineProps<{
  quizzes: Quiz[];
}>();

</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
    <CardComponent
      v-for="quiz in quizzes" 
      :key="quiz.id" 
      :title="quiz.title" 
      :level="quiz.level" 
      :category="quiz.category.name"
      :level-label="quiz.levelLabel"
      :img="quiz.category.image"
      type="quiz"
      :link="`/quizzes/${quiz.id}`"
      :description="quiz.description"
    />
  </div>
</template>

<style lang="postcss" scoped>
  
</style>
