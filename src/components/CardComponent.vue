<script lang="ts" setup>
import { useGeneralStore } from "@/stores/general";
import BadgeComponent from "@/components/BadgeComponent.vue";
const store = useGeneralStore();

defineProps<{
  title: {
    es: string;
    en: string;
  },
  level: "easy" | "medium" | "hard";
  levelLabel: {
    es: "Fácil" | "Medio" | "Difícil";
    en: "Easy" | "Medium" | "Hard";
  },
  category?: string;
  link: string;
  img: string;
  description: {
    es: string;
    en: string;
  };
  type: "quiz" | "challenge";
}>();
</script>

<template>
  <div class="bg-white dark:bg-slate-900 shadow-md rounded-lg hover:opacity-90 hover:shadow-lg dark:hover:shadow-xl transition-all duration-300 overflow-hidden">
    <router-link class="block" :to="link">
      <!-- Quiz Image -->
      <div v-if="type === 'quiz'" class="p-4 pb-0">
        <div class="w-[50px] h-[50px] bg-slate-200 dark:bg-slate-800 p-1 rounded-full flex justify-center items-center">
          <img :src="img" alt="Quiz Image" class="w-[30px]">
        </div>
      </div>
      <!-- Challenge Image -->
      <img v-if="type === 'challenge'" :src="img" alt="Challenge Image" class="w-full h-48 object-cover object-center">
      <div class="p-4">
        <!-- Category -->
        <p v-if="category" class="text-sm opacity-70 mb-1 mt-3">{{ category }}</p>
        <!-- Title -->
        <h3 class="font-bold line-clamp-1">{{ title[store.locale] }}</h3>
        <!-- Description -->
        <p class="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mt-3" :title="description[store.locale]">{{ description[store.locale] }}</p>
        <!-- Level Badge -->
        <BadgeComponent :text="levelLabel[store.locale]" :type="level" class="mt-4"/>
      </div>
    </router-link>
  </div>
</template>

<style lang="postcss" scoped>
  
</style>
