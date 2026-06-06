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
import { ScrollArea } from "@/components/ui/scroll-area";

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
  <ScrollArea class="h-full md:pr-4">
    <div>
      <div class="block md:flex justify-end items-center mb-4 px-1">
        <div class="flex flex-col items-start md:flex-row md:items-center md:justify-end gap-5">
          <!-- Category Filter -->
          <div class="flex flex-col items-start md:flex-row md:items-center gap-3 w-full">
            <Label for="category-select">{{ $t("general.category") }}:</Label>
            <Select v-model="category" id="category-select">
              <SelectTrigger size="sm" class="min-w-25 w-full">
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
          <div class="flex flex-col items-start md:flex-row md:items-center gap-3 w-full">
            <Label for="difficulty-select">{{ $t("general.difficulty") }}:</Label>
            <Select v-model="difficulty" id="difficulty-select">
              <SelectTrigger size="sm" class="min-w-25 w-full">
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
  </ScrollArea>
</template>
