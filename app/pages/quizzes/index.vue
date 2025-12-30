<script setup lang="ts">
import QuizListComponent from "@/components/quiz/QuizListComponent.vue";
import SelectComponent from "@/components/ui/SelectComponent.vue";
import useQuizData from "@/composables/quiz/useQuizData";
import useDataListFilter  from "@/composables/useDataListFilter";

definePageMeta({ menu: true, titleKey: "menu-label.quizzes" });
useStaticPageSeo("quizzes");

const {quizzes, getQuizzes} = useQuizData();
await getQuizzes();

const { locale } = useI18n();

const { 
  currentDataList, 
  selectedCategory, 
  selectedDifficulty, 
  categories, 
  difficulties 
} = useDataListFilter(quizzes);

watch(() => locale.value, async () => {
  await getQuizzes();
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
    <QuizListComponent :quizzes="currentDataList" />

    <div v-if="currentDataList.length === 0" class="text-center mt-4">
      <p class="text-xl md:text-2xl text-gray-500 dark:text-gray-600 mt-20">
        {{ $t("general.noResults") }}
      </p>
    </div>
  </div>
</template>
