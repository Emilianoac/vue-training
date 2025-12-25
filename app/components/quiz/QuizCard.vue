<script lang="ts" setup>
import BadgeComponent from "@/components/ui/BadgeComponent.vue";
import CardComponent from"@/components/ui/CardComponent.vue";

import type { Quiz } from "@/types/quiz";

defineProps<{
  quiz: Quiz;
}>();
</script>

<template>
  <CardComponent>
    <NuxtLink class="block" :to="`/quizzes/${quiz.slug}`">
      <div class="flex justify-between items-start p-4 pb-0">
        <!-- Image -->
        <div class="w-[50px] h-[50px] bg-slate-200 dark:bg-slate-800 p-1 rounded-full flex justify-center items-center">
          <img :src="quiz.category.image.url" alt="Quiz Image" class="w-[30px]">
        </div>
        <!-- Level Badge -->
        <BadgeComponent :text="$t(`general.levels.${quiz.level}`)" :type="quiz.level"/>
      </div>
      <div class="p-4">
        <!-- Category -->
        <p class="text-sm opacity-70 mb-1">{{ quiz.category.name }}</p>
        <!-- Title -->
        <h3 class="text-sm font-bold line-clamp-1">{{ quiz.title }}</h3>
        <!-- Description -->
        <p class="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mt-3" :title="quiz.description">
          {{ quiz.description }}
        </p>
      </div>
    </NuxtLink>
  </CardComponent>
</template>

<style lang="postcss" scoped>
  
</style>
