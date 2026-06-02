<script setup lang="ts">
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import QuizListComponent from "@/components/quiz/QuizListComponent.vue";
import IconList from "@/components/assets/icons/IconList.vue";
import useQuizData from "@/composables/quiz/useQuizData";
import useDataListFilter from "@/composables/useDataListFilter";

definePageMeta({
  menu: true,
  index: 2,
  titleKey: "menu-label.quizzes",
  icon: IconList,
});
useStaticPageSeo("quizzes");

const { locale } = useI18n();
const { quizzes, getQuizzes } = useQuizData();

await getQuizzes();

const {
  category,
  selectedCategory,
  categories,
  difficulty,
  selectedDifficulty,
  currentDataList,
  difficulties,
} = useDataListFilter(quizzes);

watch(
  () => locale.value,
  async () => {
    await getQuizzes();
  },
);
</script>

<template>
  <div>
    <div class="block md:flex justify-end items-center mb-4">
      <div class="flex items-center justify-end gap-5">
        <!-- Category Filter -->
        <div class="flex items-center gap-3">
          <Label for="category-select">{{ $t("general.category") }}:</Label>
          <Select v-model="category" id="category-select">
            <SelectTrigger size="sm" class="min-w-25">
              <SelectValue :placeholder="$t('general.category')">
                {{ selectedCategory.label }}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem v-for="cat in categories" :key="cat.id" :value="cat.id">
                  {{ cat.label }}
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <!-- Difficulty Filter -->
        <div class="flex items-center gap-3">
          <Label for="difficulty-select">{{ $t("general.difficulty") }}:</Label>
          <Select v-model="difficulty" id="difficulty-select">
            <SelectTrigger size="sm" class="min-w-25">
              <SelectValue :placeholder="$t('general.difficulty')">
                {{ selectedDifficulty.label }}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem v-for="dif in difficulties" :key="dif.id" :value="dif.id">
                  {{ dif.label }}
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
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
