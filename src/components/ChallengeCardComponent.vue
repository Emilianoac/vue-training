<script lang="ts" setup>
import { useGeneralStore } from "@/stores/general";

const store = useGeneralStore();

defineProps<{
  name: {
    es: string;
    en: string;
  },
  description: {
    es: string;
    en: string;
  }
  level: "easy" | "medium" | "hard";
  levelLabel: {
    es: "Fácil" | "Medio" | "Difícil";
    en: "Easy" | "Medium" | "Hard";
  },
  id: string;
  img: string;
}>();

const levelColors = {
  easy: {
    bg: "bg-green-300",
    text: "text-green-800"
  },
  medium: {
    bg: "bg-yellow-500",
    text: "text-yellow-500"
  },
  hard: {
    bg: "bg-red-500",
    text: "text-red-500"
  }
}
</script>

<template>
  <card class="bg-white  dark:bg-slate-900 shadow-md rounded-lg overflow-hidden">
    <router-link :to="`/challenges/${id}`">
      <img :src="img" alt="Challenge Image" class="w-full h-48 object-cover object-center">
      <div class="p-4">
        <h3 class="font-bold">{{ name[store.locale] }} {{  }}</h3>
        <p 
          class="inline-block px-2 py-1 rounded-full text-xs font-bold my-4"
          :class="`${levelColors[level].bg} ${levelColors[level].text}`">
            {{ levelLabel[store.locale] }}
        </p>
        <p class=" opacity-65 ">{{ description[store.locale] }}</p>
      </div>
    </router-link>
  </card>
</template>

<style lang="postcss">
  
</style>
