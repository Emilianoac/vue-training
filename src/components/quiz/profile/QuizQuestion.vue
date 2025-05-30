<script lang="ts" setup>
import { computed } from "vue";
import type { Question } from "@/types/quiz";
import { useGeneralStore } from "@/stores/general";
import { marked } from "marked";

const store = useGeneralStore();
const selectedOption = defineModel();

const props = defineProps<{
  question: Question;
  checkAnswer: boolean,
}>();

</script>

<template>
  <div class="flex items-center text-xl font-bold mb-4">
    <span class="block me-1">{{ question.id }}.</span>
    <div class="question-text" v-html="marked(question.questionText[store.locale])"></div>
  </div>
  <ul>
    <li
      v-for="answer in question.answers"
      :key="answer.id"
      class="flex items-center rounded-md gap-2 cursor-pointer relative mb-2"
    >
      <input
        class="curson-pointer ms-2 peer absolute z-10"
        v-model="selectedOption"
        :value="answer.id"
        :disabled="checkAnswer"
        type="radio"
        name="answer"
        :id="`answer-${answer.id}`"
      />
      <label
        :for="`answer-${answer.id}`"
        class="grid grid-cols-1 md:grid-cols-[1fr,max-content] items-center w-full h-full p-4 cursor-pointer rounded-md border border-slate-200 dark:border-slate-800 peer-checked:border-blue-500"
        :class="{ 
          '!border-green-500': checkAnswer && answer.isCorrect,
          '!border-red-500': checkAnswer && !answer.isCorrect,
          'hover:bg-gray-100 dark:hover:bg-slate-800' : !checkAnswer,
          'cursor-not-allowed opacity-85': checkAnswer
        }"
      >
        <span class="block w-full text-start pl-3" v-html="marked(answer.answerText[store.locale])"></span>
        <span v-if="checkAnswer && answer.isCorrect" class="text-xs font-bold inline-block text-end text-green-500">
          {{ selectedOption === answer.id ? $t('quiz.your_answer') : $t('quiz.correct_answer') }}
        </span>
        <span
          v-if="checkAnswer && !answer.isCorrect && selectedOption === answer.id"
          class="text-xs font-bold inline-block text-end text-red-500"
        >
          {{ $t('quiz.your_answer') }}
        </span>
      </label>
    </li>
  </ul>
</template>

<style lang="postcss">

</style>
