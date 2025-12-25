<script lang="ts" setup>
import BadgeComponent from "@/components/ui/BadgeComponent.vue";


defineEmits<{
  startQuiz: [];
}>();

defineProps<{
  title: string;
  description: string;
  image: string;
  category: string;
  level: "basic" | "intermediate" | "advanced";
}>();
</script>

<template>
  <div class="max-w-[500px] mx-auto bg-slate-50 dark:bg-slate-800/50 border dark:border-slate-800 border-slate-200 rounded-md p-8">
    <div>
      <div class="flex items-start justify-between mb-5">
        <!-- Quiz category icon -->
        <div class="bg-slate-200 dark:bg-slate-800/50 rounded-full h-[60px] w-[60px] flex items-center justify-center flex-shrink-0">
          <img class="max-w-[30px]" :src="image" alt="Quiz Image" />
        </div>
        <!-- Quiz Level Badge -->
        <BadgeComponent :type="level" :text="$t(`general.levels.${level}`)" class="mb-3"/>
      </div>
      <div class="flex items-start mb-6 gap-3">
        <div>
          <!-- Quiz Title -->
          <h1 class="font-bold text-2xl mb-3">{{ title }}</h1>
          <!-- Quiz Description -->
          <p class="opacity-85">{{ description }}</p>
        </div>
      </div>
    </div>
    <button 
      class="app-button primary font-semibold mx-auto block w-full"
      @click="$emit('startQuiz')">{{ $t("quiz.start_quiz") }}</button>
    </div>
</template>

<style>
  
</style>
