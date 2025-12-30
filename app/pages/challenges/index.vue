<script lang="ts" setup>
import { watch } from "vue";
import { useI18n } from "vue-i18n";
import ChallengeListComponent from "@/components/challenge/ChallengeListComponent.vue";
import SelectComponent from "@/components/ui/SelectComponent.vue";
import useChallengeData from "@/composables/challenge/useChallengeData";

definePageMeta({ menu: true, titleKey: "menu-label.challenges" });
useStaticPageSeo("challenges");

const {challenges, getChallenges} = useChallengeData();
await getChallenges();

const { locale } = useI18n();

const { 
  currentDataList : currentChallenges, 
  selectedCategory, 
  selectedDifficulty, 
  categories, 
  difficulties 
} = useDataListFilter(challenges);

watch(() => locale.value, async() => {
  await getChallenges();
});
</script>

<template>
  <div class="mt-7">
    <div class="block md:flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold text-center mb-4 md:mb-0">{{ $t("general.challenge.many") }}</h1>
      <div class="block md:flex items-center gap-5">
        <SelectComponent
          :items="difficulties"
          v-model="selectedDifficulty"
          :label="$t('general.difficulty')"
        />
      </div>
    </div>
    <ChallengeListComponent :challenges="currentChallenges" />
    <div v-if="currentChallenges.length === 0" class="text-center mt-4">
      <p class="text-xl md:text-2xl text-gray-500 dark:text-gray-600 mt-20">
        {{ $t("general.noResults") }}
      </p>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
  
</style>
