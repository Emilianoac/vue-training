import { computed, ref, type Ref } from "vue";

interface DataItem {
  category: { name: string };
  level: string;
}

export default function useDataListFilter<T extends DataItem>(data: Ref<T[]>) {
  const { t } = useI18n();

  const ALL = "all";
  const difficulty = ref(ALL);
  const category = ref(ALL);

  const selectedCategory = computed(() => {
    if (category.value === ALL) {
      return { id: ALL, label: t("general.all") };
    }

    return {
      id: category.value,
      label: category.value
    };
  });

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
        label: t(`general.levels.${name}`)
      }))
    ];
  });

  const selectedDifficulty = computed(() => {
    if (difficulty.value === ALL) {
      return { id: ALL, label: t("general.all") };
    } 

    return {
      id: difficulty.value,
      label: t(`general.levels.${difficulty.value}`)
    };
  });

  const currentDataList = computed(() => {
    return data.value.filter(item => {
      const categoryMatch =
        category.value === ALL ||
        item.category.name === category.value;

      const difficultyMatch =
        difficulty.value === ALL ||
        item.level === difficulty.value;

      return categoryMatch && difficultyMatch;
    });
  });

  return {
    category,
    selectedCategory,
    categories,

    difficulty,
    selectedDifficulty,
    difficulties,

    currentDataList
  };
}
