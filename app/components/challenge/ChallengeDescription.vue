<script setup lang="ts">
import type { Challenge } from "@/schemas/challenge.schema";
import ActivityLevelBadge from "@/components/activity/ActivityLevelBadge.vue";
import ChallengeHint from "@/components/challenge/ChallengeHint.vue";

const props = withDefaults(
  defineProps<{
    challenge: Challenge;
    showTitle?: boolean;
  }>(),
  {
    showTitle: true,
  },
);

const { t } = useI18n();
</script>

<template>
  <aside class="h-full overflow-auto">
    <ActivityLevelBadge
      class="mb-3"
      :type="props.challenge.level"
      :text="t(`general.levels.${props.challenge.level}`)"
    />
    <h1 v-if="props.showTitle" class="mb-2 text-2xl font-bold">{{ props.challenge.title }}</h1>

    <p
      v-for="paragraph in props.challenge.description"
      :key="paragraph"
      class="mb-2 text-sm last-of-type:mb-0"
    >
      {{ paragraph }}
    </p>

    <hr class="my-8 h-px border-0 bg-gray-300 dark:bg-gray-700" />

    <h2 class="font-bold">{{ t("challenge.description.instructions") }}</h2>
    <ol class="mt-2 list-inside list-decimal list">
      <li
        v-for="instruction in props.challenge.instructions"
        :key="instruction"
        class="mb-4 last-of-type:mb-0 rounded-md border bg-card p-4 text-sm marker:font-bold marker:text-primary marker:text-base"
      >
        {{ instruction }}
      </li>
    </ol>

    <template v-if="props.challenge.hints.length">
      <hr class="my-8" />

      <h2 class="font-bold">{{ t("challenge.description.hints") }}</h2>
      <ul class="mt-2 space-y-3 px-1">
        <li v-for="(hint, index) in props.challenge.hints" :key="hint.title" class="text-sm">
          <ChallengeHint :hint :number="index + 1" />
        </li>
      </ul>
    </template>
  </aside>
</template>
