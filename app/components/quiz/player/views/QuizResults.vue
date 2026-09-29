<script lang="ts" setup>
import type { AnswerRecord } from "@/schemas/quiz.schema";
import HighlightedCodeBlock from "@/components/content/HighlightedCodeBlock.vue";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import useQuizPassedCelebration from "@/composables/quiz/useQuizPassedCelebration";
import useQuizResultsPresentation from "@/composables/quiz/useQuizResultsPresentation";
import vueHostUrl from "@/assets/images/quiz/vue-host.png";

const emit = defineEmits<{
  (e: "resetQuiz"): void;
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
  requiredPercentage?: number;
}>();

const { parsedHistory, stars: starsArray } = useQuizResultsPresentation(
  () => props.userHistory,
  () => props.userStats.percentage,
);

useQuizPassedCelebration(
  () => props.userStats.percentage,
  () => props.requiredPercentage,
);
</script>

<template>
  <ScrollArea class="h-full pr-4 w-full">
    <div class="w-full overflow-y-auto">
      <div class="grid grid-cols-1 lg:grid-cols-[1.5fr_0.9fr] gap-6">
        <!-- Quiz Results Summary -->
        <div
          class="bg-slate-50 dark:bg-slate-800/50 border dark:border-slate-800 border-slate-200 p-7 rounded-lg min-h-[300px]"
        >
          <p class="font-semibold mb-7 flex items-center">
            <Icon name="mdi:trophy" class="text-yellow-500 me-2" />
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
                :name="
                  type === 'full'
                    ? 'line-md:star-filled'
                    : type === 'half'
                      ? 'line-md:star-filled-half'
                      : 'line-md:star'
                "
                class="text-yellow-400 text-4xl"
              />
            </div>
          </div>

          <!-- User Stats -->
          <div class="grid grid-cols-2 gap-4">
            <div
              class="bg-slate-200 dark:bg-slate-700/50 flex flex-col justify-center items-center rounded-md p-4"
            >
              <p class="text-2xl font-bold text-green-500">{{ userStats.correct }}</p>
              <p class="text-sm">{{ $t("quiz.results.correct") }}</p>
            </div>
            <div
              class="bg-slate-200 dark:bg-slate-700/50 flex flex-col justify-center items-center rounded-md p-4"
            >
              <p class="text-2xl font-bold text-red-500">{{ userStats.wrong }}</p>
              <p class="text-sm">{{ $t("quiz.results.wrong") }}</p>
            </div>
          </div>
        </div>

        <div
          class="bg-slate-50 dark:bg-slate-800/50 border dark:border-slate-800 border-slate-200 p-7 rounded-lg min-h-[300px]"
        >
          <!-- Time Taken -->
          <div class="flex items-center mb-5 gap-3">
            <Icon name="mdi:clock-outline" class="text-xl" />
            <div>
              <p class="text-slate-500 text-sm">{{ $t("quiz.results.time_taken") }}</p>
              <p class="font-semibold text-sm">
                {{ Math.floor(elapsedTime / 60) ? Math.floor(elapsedTime / 60) + " min" : "" }}
                {{ elapsedTime % 60 }} {{ $t("general.seconds") }}
              </p>
            </div>
          </div>

          <img :src="vueHostUrl" class="max-w-[160px] mx-auto" />

          <div class="space-y-2">
            <!-- Retake Quiz Button -->
            <Button type="button" size="lg" @click="emit('resetQuiz')" class="w-full mt-6">
              {{ $t("quiz.results.retake_quiz") }}
              <Icon name="mdi:rotate-left" class="text-xl" />
            </Button>
          </div>
        </div>
      </div>

      <div class="mt-8">
        <h2 class="text-xl font-bold mb-4">
          {{ $t("quiz.results.question_review") }}
        </h2>
        <ul>
          <li
            v-for="(question, i) in parsedHistory"
            :key="i"
            class="bg-slate-50 dark:bg-slate-800/50 border dark:border-slate-800 border-slate-200 p-6 rounded-md mb-6 last:mb-0"
          >
            <div class="flex items-start font-semibold text-[1.1em] mb-4">
              <span class="block me-1">{{ i + 1 }}.</span>
              <div v-html="question.parsedQuestion"></div>
            </div>
            <ul>
              <li
                v-for="answer in question.parsedAnswers"
                :key="answer.id"
                class="block md:flex justify-between items-center mb-2 border border-slate-200 dark:border-slate-800 p-3 rounded-md"
                :class="{
                  '!border-green-500 bg-green-800/10': answer.isCorrect,
                  '!border-red-500 bg-red-800/10': !answer.isCorrect && answer.isSelected,
                }"
              >
                <div class="block" v-html="answer.parsedText"></div>
                <span
                  v-if="answer.isCorrect"
                  class="block text-end text-xs font-semibold text-green-800 dark:text-green-500 mt-3 md:mt-0"
                >
                  {{ answer.isSelected ? $t("quiz.your_answer") : $t("quiz.correct_answer") }}
                </span>
                <span
                  v-if="!answer.isCorrect && answer.isSelected"
                  class="block text-end text-xs font-semibold text-red-500 dark:text-red-300 mt-3 md:mt-0"
                >
                  {{ $t("quiz.your_answer") }}
                </span>
              </li>
            </ul>
            <!-- Explanation -->
            <details class="mt-4">
              <summary class="cursor-pointer font-semibold">
                {{ $t("general.show") }} {{ $t("quiz.explanation") }}
              </summary>
              <div
                class="bg-slate-200 dark:bg-slate-800 rounded-md mt-2 p-3"
                v-html="question.parsedExplanation"
              ></div>

              <HighlightedCodeBlock
                v-for="codeExample in question.codeExample"
                :key="`${codeExample.language}-${codeExample.code}`"
                class="mt-5 mb-4 text-xs last-of-type:mb-0 md:text-base"
                :language="codeExample.language"
                :code="codeExample.code"
              />
            </details>
          </li>
        </ul>
      </div>
    </div>
  </ScrollArea>
</template>

<style lang="postcss" scoped></style>
