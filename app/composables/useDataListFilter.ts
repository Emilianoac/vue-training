import { ref, computed } from "vue";

export default function useDataListFilter<T extends { category: { name: string }; level: string }>(
  data: T[], 
) {
  const { t } = useI18n();
  
  const dataList = ref<T[]>(data);
  const all = computed(() => t("general.all"));

  const selectedCategory = ref(all.value);
  const selectedDifficulty = ref(all.value);

  const categories = computed(() => {
    return [all.value, ...Array.from(new Set(dataList.value.map(item => item.category.name)))];
  });

  const difficulties = computed(() => {
    return [all.value, ...Array.from(new Set(dataList.value.map(item => item.level)))];
  });

  const currentDataList = computed(() => {
    return dataList.value.filter(item => {
      const categoryMatch = selectedCategory.value === all.value || item.category.name === selectedCategory.value;
      const difficultyMatch = selectedDifficulty.value === all.value || item.level === selectedDifficulty.value;
      return categoryMatch && difficultyMatch;
    });
  });

  return { 
    dataList, 
    all, 
    selectedCategory, 
    selectedDifficulty, 
    categories, 
    difficulties, 
    currentDataList 
  };
}
