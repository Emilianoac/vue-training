<script lang="ts" setup>
import quizzes from "@/data/quizzes";
import QuizCardComponent from "@/components/quiz/QuizCardComponent.vue";

</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
    <QuizCardComponent
      v-for="quiz in quizzes" 
      :key="quiz.id" 
      :name="quiz.title" 
      :level="quiz.level" 
      :level-label="quiz.levelLabel"
      :img="quiz.category.image"
      :id="quiz.id" 
      :description="quiz.description"
    />
  </div>
</template>

<style lang="postcss" scoped>
  
</style>
