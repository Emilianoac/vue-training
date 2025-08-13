<script lang="ts" setup>
import { useGeneralStore } from "@/stores/general";
import type { Quiz, Answer, CodeExample } from "@/types/quiz";
import {marked} from "marked";

const store = useGeneralStore();

defineProps<{
  userHistory: {
    question: {en: string, es: string};
    answers: Array<Answer & {isSelected: boolean}>;
    explanation: {en: string, es: string};
    codeExample: {en: CodeExample[], es: CodeExample[]};
  }[];
  userStats: {
    total: number;
    correct: number;
    wrong: number;
    percentage: number;
  };
  quiz: Quiz;
}>();

</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-[0.6fr,2fr] gap-3">
    <div class="static md:sticky md:top-20  p-4 bg-white dark:bg-slate-900 rounded-md self-start">
      <div class="flex justify-between items-center mb-4">
        <h1 class="font-bold">{{ quiz?.title[store.locale]}}</h1>
        <img :src="quiz?.category.image" alt="Quiz Image" class="w-[30px]">
      </div>
      <ul class="mt-9 text-sm">
        <li class="mb-2 border-b border-slate-200 dark:border-slate-800 pb-2">
          {{ $t('quiz.total_questions') }}: <strong>{{ userStats.total }}</strong>
        </li>
        <li class="mb-2 border-b border-slate-200 dark:border-slate-800 pb-2">
          {{ $t('quiz.correct_answers') }}: <strong>{{ userStats.correct }}</strong>
        </li>
        <li class="mb-2 border-b border-slate-200 dark:border-slate-800 pb-2">
          {{ $t('quiz.wrong_answers') }}: <strong>{{ userStats.wrong }}</strong>
        </li>
        <li class="border-b border-slate-200 dark:border-slate-800 pb-2">
          {{ $t('quiz.success_percentage') }}: <strong>{{ userStats.percentage }}%</strong>
        </li>
      </ul>
    </div>

    <div class="bg-white dark:bg-slate-900 p-7 rounded-md">
      <ul>
        <li 
          v-for="(question, i) in userHistory" 
          :key="i" 
          class="bg-white dark:bg-slate-800/50 border dark:border-slate-800 border-slate-200 p-4 rounded-md mb-6 last:mb-0">
          <div class="flex items-center font-bold text-xl mb-4">
            <span class="block me-1">{{ i + 1 }}.</span>
            <div v-html="marked(question.question[store.locale])"></div>
          </div>
          <ul>
            <li 
              v-for="answer in question.answers" 
              :key="answer.id"
              class="block md:flex justify-between items-center mb-2 border border-slate-200 dark:border-slate-800 p-3 rounded-md" 
              :class="{
                '!border-green-500': answer.isCorrect, 
                '!border-red-500': !answer.isCorrect && answer.isSelected
              }">
              <div class="block" v-html="marked(answer.answerText[store.locale])"></div>
              <span 
                v-if="answer.isCorrect" 
                class="block text-end text-xs font-bold text-green-500">
                {{ answer.isSelected ? $t('quiz.your_answer')  : $t('quiz.correct_answer')  }}
              </span>
              <span 
                v-if="!answer.isCorrect && answer.isSelected"
                class="block text-end text-xs font-bold text-red-500">
                  {{ $t('quiz.your_answer') }}
              </span>
            </li>
          </ul>
          <!-- Explanation -->
          <div>
            <h6 class="font-bold mt-4">{{ $t('quiz.explanation') }}</h6>
            <div 
              class="p-3 bg-slate-50 dark:bg-slate-800 rounded-md mt-2 mb-4"
              v-html="marked(question.explanation[store.locale])">
            </div>
          </div>
          <!-- Code example -->
          <highlightjs 
            v-for="codeExample in question.codeExample[store.locale]"
            class="text-xs md:text-base rounded-md overflow-hidden mb-4 last-of-type:mb-0" 
            :language="codeExample.language"
            :code="codeExample.code"  
          />
          <hr class="my-10 border-t border-gray-200 dark:border-slate-800">
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
  
</style>
