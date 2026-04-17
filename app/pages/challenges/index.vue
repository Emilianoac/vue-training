<script lang="ts" setup>
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ChallengeListComponent from "@/components/challenge/ChallengeListComponent.vue";
import IconBoxGlove from "@/components/assets/icons/IconBoxGlove.vue";
import SelectComponent from "@/components/ui/SelectComponent.vue";
import useChallengeData from "@/composables/challenge/useChallengeData";

definePageMeta({
  menu: true,
  index: 3,
  titleKey: "menu-label.challenges",
  icon: IconBoxGlove,
});
useStaticPageSeo("challenges");

const { locale } = useI18n();
const { challenges, getChallenges } = useChallengeData();
await getChallenges();

const { difficulty, selectedDifficulty, difficulties, currentDataList } =
  useDataListFilter(challenges);

watch(
  () => locale.value,
  async () => {
    await getChallenges();
  },
);
</script>

<template>
  <div class="mt-5 md:mt-10">
    <div class="block md:flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold mb-6 md:mb-0">{{ $t("general.challenge.many") }}</h1>
      <div class="block md:flex items-center gap-5">
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
    <ChallengeListComponent :challenges="currentDataList" />
    <div v-if="currentDataList.length === 0" class="text-center mt-4">
      <p class="text-xl md:text-2xl text-gray-500 dark:text-gray-600 mt-20">
        {{ $t("general.noResults") }}
      </p>
    </div>
  </div>
</template>

<style lang="postcss" scoped></style>
