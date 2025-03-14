<script lang="ts" setup>
import { useGeneralStore } from "@/stores/general";
import BadgeComponent from "@/components/BadgeComponent.vue";
import { levelColors } from "@/utils/levelColors";
import CardComponent from "@/components/CardComponent.vue";

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
  <CardComponent>
    <router-link :to="`/challenges/${id}`">
      <img :src="img" alt="Challenge Image" class="w-full h-48 object-cover object-center">
      <div class="p-4">
        <h3 class="font-bold min-h-[50px] line-clamp-2">{{ name[store.locale] }}</h3>
        <BadgeComponent 
          :text="levelLabel[store.locale]" 
          :type="level"
          class="mb-4 mt-2"
         />
        <p class="opacity-65 text-sm line-clamp-2">{{ description[store.locale] }}</p>
      </div>
    </router-link>
  </CardComponent>
</template>

<style lang="postcss">
  
</style>
