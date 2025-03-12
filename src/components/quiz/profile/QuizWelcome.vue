<script lang="ts" setup>

defineEmits<{
  startQuiz: () => void;
}>();

defineProps<{
  title: string;
  description: string;
  image: string;
}>();
</script>

<template>
  <div class="max-w-[350px] w-full mx-auto text-center bg-white dark:bg-slate-900 p-4 rounded-md mb-4 shadow-">
    <div class="bg-slate-100 dark:bg-slate-800 p-1 rounded-full mb-4 mx-auto h-[60px] w-[60px] flex items-center justify-center">
      <img class="max-w-[30px]" :src="image" alt="Quiz Image" />
    </div>
    <h1 class="font-bold text-xl mb-3">{{ title }}</h1>
    <p class="opacity-85 my-6">{{ description }}</p>

    <button 
      class="app-button primary text-sm font-semibold"
      @click="$emit('startQuiz')">Start Quiz</button>
  </div>
</template>

<style lang="postcss" scoped>
  
</style>
