<script lang="ts" setup>
import type { Level } from "@/schemas/quiz.schema";
import ChipComponent from "@/components/ui/ChipComponent.vue";
import { Button } from "@/components/ui/button";

defineEmits<{
  startQuiz: [];
}>();

defineProps<{
  title: string;
  description: string;
  image: string;
  category: string;
  numberOfQuestions: number;
  level: Level;
}>();
</script>

<template>
  <div
    class="flex flex-col-reverse md:grid grid-cols-[1fr_0.6fr] bg-card border rounded-lg overflow-hidden"
  >
    <div class="p-4 md:p-10">
      <!-- Quiz Level Chip -->
      <ChipComponent :type="level" :text="$t(`general.levels.${level}`)" class="mb-3" />
      <span class="inline-block opacity-75 text-sm">{{ category }}</span>
      <!-- Quiz Title -->
      <h1 class="font-bold text-2xl md:text-4xl lg:text-5xl mb-3">{{ title }}</h1>
      <!-- Quiz Description -->
      <p class="opacity-85">{{ description }}</p>

      <Button class="mt-8" size="xl" @click="$emit('startQuiz')">
        {{ $t("quiz.start_quiz") }}
        <Icon class="ms-1" name="mdi:arrow-right" size="24" />
      </Button>

      <hr class="my-8 border-slate-200 dark:border-slate-800" />

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
      <div class="bg-accent flex justify-center items-center w-full h-full p-4">
        <img class="max-w-[140px] md:max-w-[200px] drop-shadow-md" :src="image" alt="Quiz Image" />
      </div>
    </div>
  </div>
</template>

<style></style>
