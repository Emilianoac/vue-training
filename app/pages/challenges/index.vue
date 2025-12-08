<script lang="ts" setup>
import { ref, computed, watch } from "vue";
import { useI18n } from "vue-i18n";
import challengesData from "@/data/challenges";
import ChallengeListComponent from "@/components/challenge/ChallengeListComponent.vue";
import SelectComponent from "@/components/ui/SelectComponent.vue";

definePageMeta({ menu: true, titleKey: "menu-label.challenges" });
useStaticPageSeo("challenges");
const { locale } = useI18n();
const { t } = useI18n();

const challenge = ref(challengesData);
const all = computed(() => t("general.all"));

const selectedDifficulty = ref(all.value);

const difficulties = computed(() => {
  return [all.value, ...Array.from(new Set(challenge.value.map(quiz => quiz.levelLabel[locale.value])))];
});

const currentQuizzes = computed(() => {
  return challenge.value.filter(challenge => {
    const difficultyMatch = selectedDifficulty.value === all.value || challenge.levelLabel[locale.value] === selectedDifficulty.value;
    return difficultyMatch;
  });
});

watch(() => locale.value, () => {
  selectedDifficulty.value = all.value;
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
    <ChallengeListComponent :challenges="currentQuizzes" />
    <div v-if="currentQuizzes.length === 0" class="text-center mt-4">
      <p class="text-xl md:text-2xl text-gray-500 dark:text-gray-600 mt-20">
        {{ $t("general.noResults") }}
      </p>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
  
</style>
