<script lang="ts" setup>
import { useGeneralStore } from "@/stores/general";
import type { Quiz, AnswerRecord } from "@/types/quiz";
import {marked } from "marked";
import { Icon } from "@iconify/vue";

const store = useGeneralStore();

defineEmits<{
  resetQuiz: () => void;
}>();

const props = defineProps<{
  userHistory: AnswerRecord[];
  userStats: {
    total: number;
    correct: number;
    wrong: number;
    percentage: number;
  };
  elapsedTime: number;
  quiz: Quiz;
}>();

const starsArray = getStars(props.userStats.percentage);

function getStars(p: number ) {
  const maxStars = 3
  let points = (p / 100) * maxStars

  if (p > 0 && points < 0.5) {
    points = 0.5 
  }

  const stars = []
  for (let i = 0; i < maxStars; i++) {
    if (points >= 1) {
      stars.push("full")
      points -= 1
    } else if (points >= 0.5) {
      stars.push("half")
      points -= 0.5
    } else {
      stars.push("empty")
    }
  }
  return stars
}
</script>

<template>
  <h1 class="text-3xl font-bold">{{ quiz?.title[store.locale]}}</h1>
  <p class="text-slate-500 dark:text-slate-400 mt-2 mb-6">
    {{ $t("quiz.results.quiz_completed") }}
  </p>

  <div class="grid grid-cols-1 lg:grid-cols-[1.5fr_0.8fr] gap-6">
    <!-- Quiz Results Summary -->
    <div class="bg-white dark:bg-slate-800/50 border dark:border-slate-800 border-slate-200 p-7 rounded-lg min-h-[300px]">
      <p class="font-semibold mb-7 flex items-center">
        <icon icon="mdi:trophy" class="text-yellow-500 me-2" />
        {{ $t("quiz.results.your_score") }}
      </p>

      <!-- Success Rate and Stars -->
      <div class="grid grid-cols-2 items-center gap-4 mb-10">
        <div>
          <span class="font-bold text-6xl">{{ userStats.percentage }}%</span>
          <p class="text-slate-500 dark:text-slate-400 text-sm">
            {{ $t("quiz.results.success_rate") }}
          </p>
        </div>
        <div class="flex justify-center items-center justify-self-end">
          <Icon
            v-for="(type, index) in starsArray"
            :key="index"
            :icon="type === 'full' ? 'line-md:star-filled' : type === 'half' ? 'line-md:star-filled-half' : 'line-md:star'"
            class="text-yellow-400 text-4xl"
          />
        </div>
      </div>

      <!-- User Stats -->
      <div class="grid grid-cols-2 gap-4">
        <div class="bg-slate-100 dark:bg-slate-700/50 flex flex-col justify-center items-center rounded-md p-4">
          <p class="text-2xl font-bold text-green-500">{{ userStats.correct }}</p>
          <p class="text-sm">{{ $t("quiz.results.correct") }}</p>
        </div>
        <div class="bg-slate-100 dark:bg-slate-700/50  flex flex-col justify-center items-center rounded-md p-4">
          <p class="text-2xl font-bold text-red-500">{{ userStats.wrong }}</p>
          <p class="text-sm">{{ $t("quiz.results.wrong") }}</p>
        </div>
      </div>
    </div>

    <div class="bg-white dark:bg-slate-800/50 border dark:border-slate-800 border-slate-200 p-7 rounded-lg min-h-[300px]">
      <!-- progress bar -->
      <div class="mb-6">
        <div class="flex justify-between items-center mb-2">
          <p>{{ $t("quiz.results.accuracy") }}</p>
          <p class="font-bold">{{ userStats.percentage }}%</p>
        </div>
        <div class="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
          <div 
            class="bg-color-primary h-2.5 rounded-full" 
            :style="{ width: `${userStats.percentage}%` }">
          </div>
        </div>
      </div>

      <!-- Time Taken -->
      <div class="flex items-center mb-5 gap-3">
        <icon icon="mdi:clock-outline" class="text-xl" />
        <div>
          <p class=" text-slate-500 text-sm">{{ $t("quiz.results.time_taken") }}</p>
          <p class="font-semibold">
            {{ Math.floor(elapsedTime / 60) ? Math.floor(elapsedTime / 60) + ' min' : '' }} 
            {{ elapsedTime % 60 }} seconds
          </p>
        </div>
      </div>

      <!-- Questions Answered -->
      <div class="flex items-center mb-5 gap-3">
        <icon icon="mdi:checkbox-marked-circle-outline" class="text-green-500 text-xl" />
        <div>
          <p class=" text-slate-500 text-sm">{{ $t("quiz.results.questions_correctly_answered") }}</p>
          <p class="font-semibold">
            {{ userStats.correct }} / {{ userStats.total }}
          </p>
        </div>
      </div>

      <!-- Retake Quiz Button -->
      <button 
        @click="$emit('resetQuiz')"
        class="app-button primary w-full mt-10">
        <icon icon="mdi:rotate-left" class="me-2 text-xl" />
        {{ $t("quiz.results.retake_quiz") }}
      </button>
    </div>
  </div>


  <div class="mt-8">
    <h2 class="text-xl font-bold mb-4">
      {{ $t("quiz.results.question_review") }}
    </h2>
    <ul>
      <li 
        v-for="(question, i) in userHistory" 
        :key="i" 
        class="bg-white dark:bg-slate-800/50 border dark:border-slate-800 border-slate-200 p-6 rounded-md mb-6 last:mb-0">
        <div class="flex items-center font-bold text-[1.1em] mb-4">
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
        <details class="mt-4">
          <summary class="cursor-pointer font-semibold">
            Show {{ $t('quiz.explanation') }}
          </summary>
          <div 
            class="bg-slate-50 dark:bg-slate-800 rounded-md mt-2 p-3" 
            v-html="marked(question.explanation[store.locale])">
          </div>

          <highlightjs 
            v-for="codeExample in question.codeExample[store.locale]"
            class="text-xs md:text-base rounded-md overflow-hidden mt-5 mb-4 last-of-type:mb-0" 
            :language="codeExample.language"
            :code="codeExample.code"  
          />
        </details>
      </li>
    </ul>
  </div>
</template>

<style lang="postcss" scoped>
  
</style>
