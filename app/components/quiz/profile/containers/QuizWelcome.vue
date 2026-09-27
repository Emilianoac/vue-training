<script lang="ts" setup>
import type { Level } from "@/schemas/quiz.schema";
import ActivityLevelBadge from "@/components/activity/ActivityLevelBadge.vue";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  requiredPercentage?: number;
}>();
</script>

<template>
  <ScrollArea
    type="auto"
    class="flex max-h-full w-full flex-col overflow-hidden rounded-lg border bg-card"
    viewport-class="h-auto! min-h-0 flex-auto"
  >
    <div class="flex flex-col-reverse md:grid md:grid-cols-[1fr_0.6fr]">
      <div class="p-4 md:p-10">
        <div class="flex justify-between items-center mb-3">
          <span class="block opacity-75 text-sm">{{ category }}</span>
          <ActivityLevelBadge :type="level" :text="$t(`general.levels.${level}`)" />
        </div>

        <div class="xl:max-w-[70%]">
          <h1 class="font-bold text-2xl md:text-4xl lg:text-5xl mb-3">
            {{ title }}
          </h1>

          <p class="opacity-85">{{ description }}</p>
        </div>

        <Button class="mt-8" size="xl" @click="$emit('startQuiz')">
          {{ $t("quiz.start_quiz") }}
          <Icon class="ms-1" name="mdi:arrow-right" size="24" />
        </Button>

        <hr class="my-8" />

        <div
          class="flex flex-col divide-y divide-border text-sm sm:flex-row sm:divide-x sm:divide-y-0"
        >
          <div
            class="flex flex-col py-3 first:pt-0 last:pb-0 sm:px-6 sm:py-0 sm:first:pl-0 sm:last:pr-0"
          >
            <span class="mb-1 flex items-center gap-1.5 opacity-70">
              <Icon name="mdi:help-circle-outline" class="size-4 shrink-0" />
              {{ $t("quiz.total_questions") }}
            </span>

            <span class="inline-block font-bold">{{ numberOfQuestions }}</span>
          </div>
          <div
            class="flex flex-col py-3 first:pt-0 last:pb-0 sm:px-6 sm:py-0 sm:first:pl-0 sm:last:pr-0"
          >
            <span class="mb-1 flex items-center gap-1.5 opacity-70">
              <Icon name="mdi:clock-outline" class="size-4 shrink-0" />
              {{ $t("general.duration") }}
            </span>
            <span class="inline-block font-bold">{{ $t("quiz.quiz_duration") }}</span>
          </div>
          <div
            v-if="requiredPercentage !== undefined"
            class="flex flex-col py-3 first:pt-0 last:pb-0 sm:px-6 sm:py-0 sm:first:pl-0 sm:last:pr-0"
          >
            <span class="mb-1 flex items-center gap-1.5 opacity-70">
              <Icon name="mdi:target" class="size-4 shrink-0" />
              {{ $t("quiz.welcome.passingScore") }}
            </span>

            <span class="inline-block font-bold">
              {{ $t("quiz.welcome.requiredPercentage", { percentage: requiredPercentage }) }}
            </span>
          </div>
        </div>
      </div>
      <div>
        <img :src="image" alt="Quiz Image" class="h-full w-full object-cover" />
      </div>
    </div>
  </ScrollArea>
</template>

<style></style>
