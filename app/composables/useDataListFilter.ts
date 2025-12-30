import { computed, ref, type Ref } from "vue";

export default function useDataListFilter<
  T extends { category: { name: string }; level: string }
>(data: Ref<T[]>) {

  const { t } = useI18n();

  const ALL = "all";

  const selectedCategory = ref(ALL);
  const selectedDifficulty = ref(ALL);
  
  const categories = computed(() => {
    return [
      { id: ALL, label: t("general.all") },
      ...Array.from(new Set(data.value.map(i => i.category.name))).map(name => ({
        id: name,
        label: name
      }))
    ];
  });

  const difficulties = computed(() => {
    return [
      { id: ALL, label: t("general.all") },
      ...Array.from(new Set(data.value.map(i => i.level))).map(name => ({
        id: name,
        label: name
      }))
    ];
  });

  const currentDataList = computed(() => {
    return data.value.filter(item => {
      const categoryMatch =
        selectedCategory.value === ALL ||
        item.category.name === selectedCategory.value;

      const difficultyMatch =
        selectedDifficulty.value === ALL ||
        item.level === selectedDifficulty.value;

      return categoryMatch && difficultyMatch;
    });
  });

  return {
    selectedCategory,
    selectedDifficulty,
    categories,
    difficulties,
    currentDataList
  };
}
