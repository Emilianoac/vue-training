<script lang="ts" setup>
import BadgeComponent from "@/components/BadgeComponent.vue";

defineEmits<{
  startQuiz: () => void;
}>();

defineProps<{
  title: string;
  description: string;
  image: string;
  category: string;
  level: "basic" | "intermediate" | "advanced";
  levelLabel: string;
}>();
</script>

<template>
  <div class="max-w-[450px] w-full mx-auto text-center bg-white dark:bg-slate-900 p-4 rounded-md mb-4 shadow-">
    <!-- Quiz Image -->
    <div class="bg-slate-100 dark:bg-slate-800 p-1 rounded-full mx-auto h-[60px] w-[60px] flex items-center justify-center">
      <img class="max-w-[30px]" :src="image" alt="Quiz Image" />
    </div>
    <!-- Quiz Level Badge -->
    <BadgeComponent :type="level" :text="levelLabel" class="mx-auto my-3"/>
    <!-- Quiz Category -->
     <span class="text-sm text-gray-600 dark:text-gray-400">{{ category }}</span>
    <!-- Quiz Title -->
    <h1 class="font-bold text-xl">{{ title }}</h1>
    <hr class="my-5 border-gray-200 dark:border-slate-800">
    <!-- Quiz Description -->
    <p class="opacity-70 mb-7">{{ description }}</p>
    <!-- Start Quiz Button -->
    <button 
      class="app-button primary font-semibold mx-auto block w-full"
      @click="$emit('startQuiz')">{{ $t("quiz.start_quiz") }}</button>
  </div>
</template>

<style>
  
</style>
