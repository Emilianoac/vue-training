<script lang="ts" setup>
import type { QuizListItem } from "@/schemas/quiz.schema";

import ChipComponent from "@/components/ui/ChipComponent.vue";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

defineProps<{
  quiz: QuizListItem;
}>();
</script>

<template>
  <Card class="p-0 hover:bg-card/80">
    <Button
      as-child
      variant="link"
      class="h-auto w-full block p-0 whitespace-break-spaces rounded-xl text-foreground decoration-0"
    >
      <NuxtLink class="block" :to="`/quizzes/${quiz.slug}`">
        <CardContent class="px-4">
          <div class="flex justify-between items-start py-4 pb-0">
            <!-- Image -->
            <div
              class="w-12.5 h-12.5 bg-slate-200 dark:bg-slate-800 p-1 rounded-full flex justify-center items-center"
            >
              <img :src="quiz.category.image.url" alt="Quiz Image" class="w-7.5" />
            </div>
            <!-- Level Chip -->
            <ChipComponent :text="$t(`general.levels.${quiz.level}`)" :type="quiz.level" />
          </div>
          <div class="p-4">
            <!-- Category -->
            <p class="text-sm opacity-70 mb-1">{{ quiz.category.name }}</p>
            <!-- Title -->
            <h3 class="text-sm font-bold line-clamp-1">{{ quiz.title }}</h3>
            <!-- Description -->
            <p
              class="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mt-3"
              :title="quiz.description"
            >
              {{ quiz.description }}
            </p>
          </div>
        </CardContent>
      </NuxtLink>
    </Button>
  </Card>
</template>

<style lang="postcss" scoped></style>
