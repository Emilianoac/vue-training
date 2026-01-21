<script lang="ts" setup>
import type { Question } from "@/types/quiz";
import { marked } from "marked";

import QuizAnswerOption from "./QuizAnswerOption.vue";

const props = defineProps<{
  selectedOption: string | null;
  question: Question;
  checkAnswer: boolean;
  questionIndex: number;
}>();

const emit = defineEmits<{
  (e: 'update:selectedOption', value: string | null): void;
}>();

</script>

<template>

  <div class="block md:flex items-center text-xl font-bold mb-4">
    <span class="block me-1">{{ questionIndex }}.</span>
    <div class="question-text" v-html="marked(question.questionText)"></div>
  </div>

  <ul>
    <li
      v-for="answer in question.answers"
      :key="answer.id"
      class="flex items-center rounded-md gap-2 cursor-pointer relative mb-2"
    >

    <QuizAnswerOption
      :answer-id="answer.id"
      :answer-text="answer.answerText"
      :isSelected="selectedOption === answer.id"
      :isCorrectAnswer="answer.isCorrect"
      :showAnswerResult="checkAnswer"
      :isDisabled="checkAnswer"
      @select="(option) => emit('update:selectedOption', option)"
    />
    </li>
  </ul>
</template>

<style lang="postcss">

</style>
