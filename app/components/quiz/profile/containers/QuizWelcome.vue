<script lang="ts" setup>
import BadgeComponent from "@/components/ui/BadgeComponent.vue";
import BaseButton from "@/components/ui/BaseButton.vue";


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
  <div class="grid grid-cols-[1fr_0.8fr] gap-12">
    <div>
      <NuxtLink to="/quizzes" class="mb-8 inline-flex items-center hover:opacity-50">
        <Icon class="me-1" name="mdi:arrow-left" size="24"/>
        Return to quizzes
      </NuxtLink>

      <!-- Quiz Level Badge -->
      <BadgeComponent :type="level" :text="$t(`general.levels.${level}`)" class="mb-3"/>

      <!-- Quiz Title -->
      <h1 class="font-bold text-5xl mb-3">{{ title }}</h1>
      <!-- Quiz Description -->
      <p class="opacity-85">{{ description }}</p>

      <BaseButton
        class="font-semibold my-8"
        type="button"
        @click="$emit('startQuiz')">
          {{ $t("quiz.start_quiz") }}
          <Icon class="ms-1" name="mdi:arrow-right" size="24"/>
      </BaseButton>
    </div>
    <div>
      <div class="bg-slate-200 dark:bg-slate-800/50 flex justify-center items-center h-svh w-full rounded-md">
        <img class="max-w-[200px]" :src="image" alt="Quiz Image" />
      </div>
    </div>
  </div>
  <div class="hidden max-w-[500px] mx-auto bg-slate-50 dark:bg-slate-800/50 border dark:border-slate-800 border-slate-200 rounded-md p-8">
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
    <BaseButton
      class="font-semibold mx-auto block w-full"
      type="button"
      @click="$emit('startQuiz')">{{ $t("quiz.start_quiz") }}
    </BaseButton>
    </div>
</template>

<style>
  
</style>
