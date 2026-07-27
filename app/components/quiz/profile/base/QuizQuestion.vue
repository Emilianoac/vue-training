<script lang="ts" setup>
import type { Question } from "@/schemas/quiz.schema";
import useMarkdownParser from "@/composables/useMarkdownParser";
import QuizAnswerOption from "./QuizAnswerOption.vue";
import ScrollArea from "@/components/ui/scroll-area/ScrollArea.vue";

const { parse } = useMarkdownParser();

const props = defineProps<{
  selectedOption: string | null;
  question: Question;
  checkAnswer: boolean;
  questionIndex: number;
}>();

const emit = defineEmits<{
  (e: "update:selectedOption", value: string | null): void;
}>();

const parsedQuestion = computed(() => parse(props.question.text));

const parsedAnswers = computed(() =>
  props.question.answers.map((a) => ({
    ...a,
    parsedtext: parse(a.text),
  })),
);
</script>

<template>
  <div class="flex h-full min-h-0 flex-col gap-2">
    <div class="block shrink-0 font-semibold md:flex md:items-center md:text-[1.2rem]">
      <span class="block me-1">{{ questionIndex }}.</span>
      <div class="question-text" v-html="parsedQuestion"></div>
    </div>

    <ScrollArea type="auto" class="min-h-0 flex-1 pr-4">
      <ul class="flex flex-col gap-3">
        <li
          v-for="answer in parsedAnswers"
          :key="answer.id"
          class="relative flex cursor-pointer items-center gap-2 rounded-md"
        >
          <QuizAnswerOption
            :answer-id="answer.id"
            :answer-text="answer.parsedtext"
            :isSelected="selectedOption === answer.id"
            :isCorrectAnswer="answer.isCorrect"
            :showAnswerResult="checkAnswer"
            :isDisabled="checkAnswer"
            @select="(option) => emit('update:selectedOption', option)"
          />
        </li>
      </ul>
    </ScrollArea>
  </div>
</template>

<style lang="postcss"></style>
