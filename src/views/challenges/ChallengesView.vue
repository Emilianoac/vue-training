<script lang="ts" setup>
import { ref, computed, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useGeneralStore } from "@/stores/general";
import challengesData from "@/data/challenges";
import ChallengeListComponent from "@/components/challenge/ChallengeListComponent.vue";
import SelectComponent from "@/components/SelectComponent.vue";

const store = useGeneralStore();
const { t } = useI18n();

const challenge = ref(challengesData);
const all = computed(() => t("general.all"));

const selectedDifficulty = ref(all.value);

const difficulties = computed(() => {
  return [all.value, ...Array.from(new Set(challenge.value.map(quiz => quiz.levelLabel[store.locale])))];
});

const currentQuizzes = computed(() => {
  return challenge.value.filter(challenge => {
    const difficultyMatch = selectedDifficulty.value === all.value || challenge.levelLabel[store.locale] === selectedDifficulty.value;
    return difficultyMatch;
  });
});

watch(() => store.locale, () => {
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
