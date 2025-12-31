<script lang="ts" setup>
import { computed } from "vue";
import type { Question } from "@/types/quiz";
import { marked } from "marked";

defineEmits<{
  closeModal: []
}>();

const props = defineProps<{
  question: Question;
}>();

const correctAnswer = computed(() => {
  return props.question.answers.find((answer) => answer.isCorrect);
});

</script>

<template>
  <div 
    class="fixed top-0 bottom-0 left-0 right-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999] backdrop-blur-md"
    @click.self="$emit('closeModal')">
      <div class="bg-white dark:bg-slate-900 rounded-md w-full max-w-[700px] max-h-[90vh] overflow-y-auto relative mx-6">
        <div class="p-4 md:p-8 text-sm md:text-base">
          <div class="flex justify-between items-center">
            <h4 class="font-bold text-xl md:text-2xl">{{ $t('quiz.details') }}</h4>

            <button 
              @click="$emit('closeModal')"
              :title="$t('quiz.close_details')"
              class="bg-slate-300 dark:bg-slate-700 rounded-md p-2 flex items-center text-sm text-slate-600 dark:text-slate-100 hover:text-slate-700 dark:hover:text-slate-300">
              <Icon name="mdi:close" size="18"></Icon>
            </button>
          </div>
          
          <dl class="mt-9 bg-slate-100 dark:bg-slate-800/60 p-3 rounded-md">
            <dt class="font-bold">{{ $t("quiz.question") }}</dt>
            <dd class="mt-1 text-sm" v-html="marked(question.questionText)"></dd>
          </dl>

          <dl class="mt-4 bg-slate-100 dark:bg-slate-800/60 p-3 rounded-md">
            <dt class="font-bold">{{ $t("quiz.correct_answer") }}</dt>
            <dd class="mt-1 text-sm" v-html="marked(correctAnswer?.answerText ?? '')"></dd>
          </dl>

          
          <hr class="my-5 border-slate-200 dark:border-slate-800">
  
          <h3 class="font-bold">{{ $t("quiz.explanation") }}</h3>
  
          <!-- Explanation -->
          <div class="mt-2 mb-5 text-sm" v-html="marked(question.correctAnswerExplanation)"></div>
  
          <!-- Code Example --> 
          <template v-for="codeExample in question.correctAnswerCodeExample">
            <highlightjs 
              class="text-sm rounded-md overflow-hidden mt-4" 
              :language="codeExample.language"
              :code="codeExample.code"
            />
          </template>
        </div>
      </div>
  </div>
</template>

<style lang="postcss" scoped>
  
</style>
