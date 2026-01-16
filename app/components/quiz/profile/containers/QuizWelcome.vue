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
  numberOfQuestions:  number,
  level: "basic" | "intermediate" | "advanced";
}>();
</script>

<template>
  <div>
    <NuxtLink to="/quizzes" class="mb-6 inline-flex items-center hover:opacity-50">
      <Icon class="me-1" name="mdi:arrow-left" size="24"/>
      {{ $t("quiz.return_to_quizzes") }}
    </NuxtLink>
  
    <div class="flex flex-col-reverse md:grid grid-cols-[1fr_0.6fr] bg-slate-100 dark:bg-slate-800/50 border dark:border-slate-800 border-slate-200 rounded-lg overflow-hidden">
      <div class="p-4 md:p-10">
        <!-- Quiz Level Badge -->
        <BadgeComponent :type="level" :text="$t(`general.levels.${level}`)" class="mb-3"/>
        <span class="inline-block opacity-75 text-sm">{{ category }}</span>
        <!-- Quiz Title -->
        <h1 class="font-bold text-2xl md:text-4xl lg:text-5xl mb-3">{{ title }}</h1>
        <!-- Quiz Description -->
        <p class="opacity-85">{{ description }}</p>
  
        <BaseButton
          class="font-semibold mt-8"
          type="button"
          @click="$emit('startQuiz')">
            {{ $t("quiz.start_quiz") }}
            <Icon class="ms-1" name="mdi:arrow-right" size="24"/>
        </BaseButton>
  
        <hr class="my-8 border-slate-200 dark:border-slate-800">
  
        <div class="flex gap-10">
          <div class="flex flex-col">
            <span class="inline-block text-sm opacity-70 mb-1">{{ $t("general.questions") }}</span>
            <span class="inline-block font-bold">{{ numberOfQuestions }}</span>
          </div>
          <div class="flex flex-col">
            <span class="inline-block text-sm opacity-70 mb-1">{{ $t("general.duration") }}</span>
            <span class="inline-block font-bold">{{ $t("quiz.quiz_duration") }}</span>
          </div>
        </div>
      </div>
      <div>
        <div class="bg-slate-200 dark:bg-slate-800/50 flex justify-center items-center w-full h-full p-4">
          <img class="max-w-[140px] md:max-w-[200px] drop-shadow-md" :src="image" alt="Quiz Image" />
        </div>
      </div>
    </div>
  </div>
</template>

<style>
  
</style>
