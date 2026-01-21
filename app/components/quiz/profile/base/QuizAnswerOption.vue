<script setup lang="ts">
import { marked } from "marked";

const props = defineProps<{
  answerId: string;
  answerText: string;

  isSelected: boolean;
  isDisabled: boolean;

  isCorrectAnswer: boolean;
  showAnswerResult: boolean;
}>();

const emit = defineEmits<{
  (e: "select", answerId: string): void;
}>();

const showCorrect = computed(() => props.showAnswerResult && props.isCorrectAnswer);
const showWrongSelected = computed(() => props.showAnswerResult && !props.isCorrectAnswer && props.isSelected);

</script>

<template>

  <input
    type="radio"
    :id="`answer-${answerId}`"
    name="option"
    class="sr-only"
    :checked="isSelected"
    :disabled="isDisabled"
    @change="emit('select', answerId)"
  />
  
  <label
  :for="`answer-${answerId}`"
  class="
    grid grid-cols-1 md:grid-cols-[1fr,max-content]
    items-center w-full p-4 cursor-pointer rounded-md border
    border-slate-200 dark:border-slate-800
    peer-checked:border-blue-500
  "
  :class="{
    '!border-green-500 bg-green-800/10': showCorrect,
    
    '!border-red-500 bg-red-800/10': showWrongSelected,
    
    'hover:bg-gray-100 dark:hover:bg-slate-800': !showAnswerResult,
    
    '!cursor-not-allowed opacity-85':isDisabled
  }"
>
  <div class="flex items-center gap-1">
    <div 
      class="bg-white border-2 flex-shrink-0 border-gray-400 rounded-sm h-[18px] w-[18px] ring-2 ring-transparent flex justify-center items-center"
      :class="{'!border-indigo-500' : isSelected}">
        <div v-if="isSelected" class="w-[70%] h-[70%] rounded-sm bg-indigo-500"></div>
    </div>
    <span class="block w-full text-start pl-3" v-html="marked(answerText)"/>
  </div>

  <span v-if="showCorrect" class="selected-option-message text-green-800 dark:text-green-500">
    {{ isSelected ? $t('quiz.your_answer') : $t('quiz.correct_answer') }}
    <Icon name="mdi:check" size="18" />
  </span>

  <span v-if="showWrongSelected" class="selected-option-message text-red-500 dark:text-red-300">
    {{ $t('quiz.your_answer') }}
    <Icon name="mdi:close" size="18" />
  </span>
</label>

</template>

<style lang="postcss" scoped>
  .selected-option-message {
    @apply flex items-center justify-end gap-1 text-xs font-bold;
  }
</style>

