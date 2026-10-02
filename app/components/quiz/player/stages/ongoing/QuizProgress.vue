<script lang="ts" setup>
const props = defineProps<{
  progress: number;
  currentQuestionIndex: number;
  quizLength: number;
}>();

const completedQuestions = computed(() => Math.round((props.progress / 100) * props.quizLength));
</script>

<template>
  <div class="space-y-2 bg-background pb-2 z-20">
    <!-- Progress Bar -->
    <div
      class="flex w-full gap-1"
      role="progressbar"
      :aria-valuenow="completedQuestions"
      aria-valuemin="0"
      :aria-valuemax="quizLength"
    >
      <div
        v-for="questionNumber in quizLength"
        :key="questionNumber"
        class="h-2.5 flex-1 rounded-full border-1 border-transparent transition-colors duration-500 ease-in-out"
        :class="[
          questionNumber <= completedQuestions ? 'bg-blue-300' : 'bg-gray-200 dark:bg-gray-700',
          questionNumber === currentQuestionIndex ? 'border-blue-500!' : '',
        ]"
        :aria-current="questionNumber === currentQuestionIndex ? 'step' : undefined"
      ></div>
    </div>
  </div>
</template>

<style lang="postcss" scoped></style>
