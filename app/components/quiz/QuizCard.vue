<script lang="ts" setup>
import type { QuizListItem } from "@/schemas/quiz.schema";

import ActivityLevelBadge from "@/components/activity/ActivityLevelBadge.vue";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

defineProps<{
  quiz: QuizListItem;
}>();
</script>

<template>
  <Card class="p-0 hover:bg-card/80">
    <Button
      as-child
      variant="link"
      class="h-auto w-full block p-0 whitespace-break-spaces rounded-xl text-foreground hover:no-underline"
    >
      <NuxtLink class="block overflow-hidden" :to="`/quizzes/${quiz.slug}`">
        <div class="relative">
          <ActivityLevelBadge
            class="absolute top-2 right-2"
            :text="$t(`general.levels.${quiz.level}`)"
            :type="quiz.level"
          />
          <img
            :src="quiz.subCategory.image.url"
            :alt="quiz.subCategory.name"
            class="h-[150px] w-full object-cover aspect-21/19"
          />
        </div>
        <CardContent class="px-4">
          <div class="p-4 px-0">
            <!-- Category -->
            <p class="text-sm opacity-70 mb-2">
              {{ quiz.category.name }} - {{ quiz.subCategory.name }}
            </p>
            <!-- Title -->
            <h3 class="text-base font-bold line-clamp-1" :title="quiz.title">{{ quiz.title }}</h3>
            <!-- Description -->
            <p
              class="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mt-3"
              :title="quiz.description"
            >
              {{ quiz.description }}
            </p>
            <div class="mt-3 flex flex-wrap gap-1.5">
              <Badge
                v-for="topic in quiz.topics"
                :key="topic.id"
                class="border-transparent bg-black text-xs font-normal text-white dark:bg-white dark:text-black"
              >
                {{ topic.label }}
              </Badge>
            </div>
          </div>
        </CardContent>
      </NuxtLink>
    </Button>
  </Card>
</template>

<style lang="postcss" scoped></style>
