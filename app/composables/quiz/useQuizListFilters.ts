
import type { Quiz } from "@/types/quiz";

export function useQuizListFilters(quizzesData: Quiz[]) {
  const { t } = useI18n();
  
  const quizzes = ref(quizzesData);
  const all = computed(() => t("general.all"));

  const selectedCategory = ref(all.value);
  const selectedDifficulty = ref(all.value);

  const categories = computed(() => {
    return [all.value, ...Array.from(new Set(quizzes.value.map(quiz => quiz.category.name)))];
  });

  const difficulties = computed(() => {
    return [all.value, ...Array.from(new Set(quizzes.value.map(quiz => quiz.level)))];
  });

  const currentQuizzes = computed(() => {
    return quizzes.value.filter(quiz => {
      const categoryMatch = selectedCategory.value === all.value || quiz.category.name === selectedCategory.value;
      const difficultyMatch = selectedDifficulty.value === all.value || quiz.level === selectedDifficulty.value;
      return categoryMatch && difficultyMatch;
    });
  });

  return { 
    quizzes, 
    all, 
    selectedCategory, 
    selectedDifficulty, 
    categories, 
    difficulties, 
    currentQuizzes 
  };
}
