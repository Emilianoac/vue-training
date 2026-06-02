<script setup lang="ts">
import type { Challenge } from "@/schemas/challenge.schema";
import ChipComponent from "@/components/ui/ChipComponent.vue";

const props = defineProps<{
  challenge: Challenge;
}>();

const { t } = useI18n();
</script>

<template>
  <aside class="h-full overflow-auto">
    <ChipComponent
      class="mb-3"
      :type="props.challenge.level"
      :text="t(`general.levels.${props.challenge.level}`)"
    />
    <h1 class="mb-2 text-2xl font-bold">{{ props.challenge.title }}</h1>

    <p
      v-for="paragraph in props.challenge.description"
      :key="paragraph"
      class="mb-2 text-sm last-of-type:mb-0"
    >
      {{ paragraph }}
    </p>

    <hr class="my-8 h-px border-0 bg-gray-300 dark:bg-gray-700" />

    <h2 class="font-bold">{{ t("challenge.description.instructions") }}</h2>
    <ol
      class="mt-2 list-inside list-decimal rounded-md bg-slate-100 p-4 text-sm text-gray-900 dark:bg-slate-800/50 dark:text-gray-300"
    >
      <li
        v-for="instruction in props.challenge.instructions"
        :key="instruction"
        class="mb-4 last-of-type:mb-0"
      >
        {{ instruction }}
      </li>
    </ol>

    <template v-if="props.challenge.hints.length">
      <hr class="my-8 h-px border-0 bg-gray-300 dark:bg-gray-700" />

      <h2 class="font-bold">{{ t("challenge.description.hints") }}</h2>
      <ul class="mt-2 space-y-3">
        <li
          v-for="hint in props.challenge.hints"
          :key="hint.title"
          class="rounded-md border bg-card p-4 text-sm"
        >
          <h3 class="font-semibold text-foreground">{{ hint.title }}</h3>
          <p class="mt-1 text-muted-foreground">{{ hint.body }}</p>
        </li>
      </ul>
    </template>
  </aside>
</template>
