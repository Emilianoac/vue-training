<script lang="ts" setup>

defineProps<{
  progress: number;
  currentQuestionIndex: number;
  quizLength: number;
}>();
</script>

<template>
  <!-- Quiz Progress -->
  <div class="flex justify-between items-center mb-4">
    <p class="text-sm font-semibold text-gray-500 dark:text-gray-400">
      {{ $t('quiz.question') }} {{ currentQuestionIndex }} {{ $t('general.of') }} {{ quizLength }}
    </p>
  </div>

  <!-- Progress Bar -->
  <div class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mb-6">
    <div 
      class="bg-color-primary h-2.5 rounded-full transition-[width] duration-500 ease-in-out" 
      :style="{ width: `${progress}%` }">
    </div>
  </div>
</template>

<style lang="postcss" scoped>
  
</style>
