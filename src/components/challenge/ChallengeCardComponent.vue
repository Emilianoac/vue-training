<script lang="ts" setup>
import { useGeneralStore } from "@/stores/general";
import BadgeComponent from "@/components/BadgeComponent.vue";
import { levelColors } from "@/utils/levelColors";

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
</script>

<template>
  <card class="bg-white  dark:bg-slate-900 shadow-md rounded-lg overflow-hidden">
    <router-link :to="`/challenges/${id}`">
      <img :src="img" alt="Challenge Image" class="w-full h-48 object-cover object-center">
      <div class="p-4">
        <h3 class="font-bold">{{ name[store.locale] }}</h3>
        <BadgeComponent 
          :text="levelLabel[store.locale]" 
          :type="level"
          class="my-4"
         />
        <p class=" opacity-65 ">{{ description[store.locale] }}</p>
      </div>
    </router-link>
  </card>
</template>

<style lang="postcss">
  
</style>
