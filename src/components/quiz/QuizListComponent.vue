<script lang="ts" setup>
import quizzes from "@/data/quizzes";
import CardComponent from "@/components/CardComponent.vue";

</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
    <CardComponent
      v-for="quiz in quizzes" 
      :key="quiz.id" 
      :title="quiz.title" 
      :level="quiz.level" 
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
