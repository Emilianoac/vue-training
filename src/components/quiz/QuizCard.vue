<script lang="ts" setup>
import { useGeneralStore } from "@/stores/general";
import BadgeComponent from "@/components/ui/BadgeComponent.vue";
import CardComponent from"@/components/ui/CardComponent.vue";

import type { Quiz } from "@/types/quiz";

const store = useGeneralStore();

defineProps<{
  quiz: Quiz;
}>();
</script>

<template>
  <CardComponent>
    <router-link class="block" :to="`/quizzes/${quiz.id}`">
      <div class="flex justify-between items-start p-4 pb-0">
        <!-- Image -->
        <div class="w-[50px] h-[50px] bg-slate-200 dark:bg-slate-800 p-1 rounded-full flex justify-center items-center">
          <img :src="quiz.category.image" alt="Quiz Image" class="w-[30px]">
        </div>
        <!-- Level Badge -->
        <BadgeComponent :text="quiz.levelLabel[store.locale]" :type="quiz.level"/>
      </div>
      <div class="p-4">
        <!-- Category -->
        <p class="text-sm opacity-70 mb-1">{{ quiz.category.name }}</p>
        <!-- Title -->
        <h3 class="text-sm font-bold line-clamp-1">{{ quiz.title[store.locale] }}</h3>
        <!-- Description -->
        <p class="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mt-3" :title="quiz.description[store.locale]">
          {{ quiz.description[store.locale] }}
        </p>
      </div>
    </router-link>
  </CardComponent>
</template>

<style lang="postcss" scoped>
  
</style>
