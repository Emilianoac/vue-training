<script lang="ts" setup>
import { useGeneralStore } from "@/stores/general";
import BadgeComponent from "@/components/BadgeComponent.vue";
import CardComponent from "@/components/CardComponent.vue";

const store = useGeneralStore();

defineProps<{
  name: {
    es: string;
    en: string;
  },
  level: "easy" | "medium" | "hard";
  levelLabel: {
    es: "Fácil" | "Medio" | "Difícil";
    en: "Easy" | "Medium" | "Hard";
  },
  category: string;
  id: string;
  img: string;
  description: {
    es: string;
    en: string;
  };
}>();
</script>

<template>
  <CardComponent>
    <router-link class="p-4 block" :to="`/quizzes/${id}`">
      <div class="w-[50px] h-[50px] bg-slate-200 dark:bg-slate-800 p-1 rounded-full flex justify-center items-center">
        <img :src="img" alt="Challenge Image" class="w-[30px]">
      </div>
      <div class="mt-3">
        <p class="text-sm opacity-70 mb-1">{{ category  }}</p>
        <h3 class="font-bold line-clamp-1">{{ name[store.locale] }}</h3>
        <BadgeComponent 
          :text="levelLabel[store.locale]" 
          :type="level"
          class="my-4"
         />
      </div>
      <p 
        class="text-sm text-gray-500 dark:text-gray-400 line-clamp-2"
        :title="description[store.locale]">
          {{ description[store.locale] }}
      </p>
    </router-link>
  </CardComponent>
</template>

<style lang="postcss">
  
</style>
