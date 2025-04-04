<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useGeneralStore } from "@/stores/general";
import quizzesData from "@/data/quizzes";
import QuizListComponent from "@/components/quiz/QuizListComponent.vue";
import SelectComponent from "@/components/SelectComponent.vue";

const store = useGeneralStore();
const { t } = useI18n();

const quizzes = ref(quizzesData);
const all = computed(() => t("general.all"));

const selectedCategory = ref(all.value);
const selectedDifficulty = ref(all.value);

const categories = computed(() => {
  return [all.value, ...Array.from(new Set(quizzes.value.map(quiz => quiz.category.name)))];
});

const difficulties = computed(() => {
  return [all.value, ...Array.from(new Set(quizzes.value.map(quiz => quiz.levelLabel[store.locale])))];
});

const currentQuizzes = computed(() => {
  return quizzes.value.filter(quiz => {
    const categoryMatch = selectedCategory.value === all.value || quiz.category.name === selectedCategory.value;
    const difficultyMatch = selectedDifficulty.value === all.value || quiz.levelLabel[store.locale] === selectedDifficulty.value;
    return categoryMatch && difficultyMatch;
  });
});

watch(() => store.locale, () => {
  selectedCategory.value = all.value;
  selectedDifficulty.value = all.value;
});
</script>

<template>
  <div class="mt-7">
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
