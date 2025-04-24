<script lang="ts" setup>
import { computed } from "vue";
import type { Question } from "@/types/quiz";
import { useGeneralStore } from "@/stores/general";

defineEmits<{
  closeModal: void;
}>();
const store = useGeneralStore();

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
      <div class="bg-slate-100 dark:bg-slate-900 rounded-md w-full max-w-[700px] max-h-[90vh] overflow-y-auto relative mx-6">
        <div class="p-4 md:p-8 text-sm md:text-base">
          <button 
            @click="$emit('closeModal')"
            class="text-sm text-slate-600 dark:text-slate-400 absolute top-4 right-4 hover:text-slate-700 dark:hover:text-slate-300">
            [ {{ $t("quiz.close_details") }} ]
          </button>
          
          <dl class="mt-4">
            <dt class="font-bold">{{ $t("quiz.question") }}</dt>
            <dd class="mt-2">{{ question.questionText[store.locale] }}</dd>
  
            <dt class="font-bold mt-4">Respuesta correcta</dt>
            <dd class="mt-2">{{ correctAnswer?.answerText[store.locale] }}</dd>
          </dl>
  
          <hr class="my-5 border-slate-200 dark:border-slate-800">
  
          <h3 class="font-bold">{{ $t("quiz.explanation") }}</h3>
  
          <!-- Explanation -->
          <div class="mt-4 bg-slate-200 dark:bg-slate-800 p-4 rounded-md">
            <p>{{ question.correctAnswerExplanation[store.locale] }}</p>
          </div>
  
          <!-- Code Example --> 
          <template v-for="codeExample in question.correctAnswerCodeExample[store.locale]">
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
