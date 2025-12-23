<script setup lang="ts">
import QuizListComponent from "@/components/quiz/QuizListComponent.vue";
import SelectComponent from "@/components/ui/SelectComponent.vue";
import { useQuizListFilters } from "@/composables/quiz/useQuizListFilters";
import useQuizData from "@/composables/quiz/useQuizData";

definePageMeta({ menu: true, titleKey: "menu-label.quizzes" });
useStaticPageSeo("quizzes");

const { locale } = useI18n();

const {quizzes, getQuizzes} = useQuizData();
await getQuizzes();

const { 
  all, 
  selectedCategory, 
  selectedDifficulty, 
  categories, 
  currentQuizzes, 
  difficulties 
} = useQuizListFilters(quizzes.value);

watch(() => locale.value, () => {
  selectedCategory.value = all.value;
  selectedDifficulty.value = all.value;
});
</script>

<template>
  <div class="mt-10">
    <div class="block md:flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold text-center mb-4 md:mb-0">{{ $t("general.quiz.many") }}</h1>
      <div class="block md:flex items-center gap-5">
        <SelectComponent
          :items="categories"
          v-model="selectedCategory"
          :label="$t('general.category')"
        />
        <SelectComponent
          :items="difficulties"
          v-model="selectedDifficulty"
          :label="$t('general.difficulty')"
        />
      </div>
    </div>
    <QuizListComponent :quizzes="currentQuizzes" />

    <div v-if="currentQuizzes.length === 0" class="text-center mt-4">
      <p class="text-xl md:text-2xl text-gray-500 dark:text-gray-600 mt-20">
        {{ $t("general.noResults") }}
      </p>
    </div>
  </div>
</template>
