<script setup lang="ts">
import type { Answer } from "@/schemas/quiz.schema";
import useMarkdownParser from "@/composables/useMarkdownParser";
import QuizAnswerOption from "./QuizAnswerOption.vue";

const props = defineProps<{
  answers: Answer[];
  selectedOption: string | null;
  showAnswerResult: boolean;
  eliminatedOptionIds?: string[];
}>();

const emit = defineEmits<{
  (e: "update:selectedOption", value: string): void;
}>();

const { parse } = useMarkdownParser();

const parsedAnswers = computed(() =>
  props.answers.map((answer, index) => ({
    ...answer,
    optionLabel: String.fromCharCode(65 + index),
    parsedText: parse(answer.text),
  })),
);

</script>

<template>
  <ul class="grid grid-cols-1 md:grid-cols-2 gap-3">
    <li
      v-for="answer in parsedAnswers"
      :key="answer.id"
      class="relative flex cursor-pointer items-center gap-2 rounded-md"
    >
      <QuizAnswerOption
        :answer-id="answer.id"
        :answer-text="answer.parsedText"
        :option-label="answer.optionLabel"
        :is-selected="selectedOption === answer.id"
        :is-eliminated="eliminatedOptionIds?.includes(answer.id) ?? false"
        :is-correct-answer="answer.isCorrect"
        :show-answer-result="showAnswerResult"
        :is-disabled="showAnswerResult || (eliminatedOptionIds?.includes(answer.id) ?? false)"
        @select="emit('update:selectedOption', $event)"
      />
    </li>
  </ul>
</template>
