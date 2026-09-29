<script lang="ts" setup>
import type { Level } from "@/schemas/quiz.schema";
import ActivityLevelBadge from "@/components/activity/ActivityLevelBadge.vue";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import vueHostUrl from "@/assets/images/quiz/vue-host.png";

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
  <div class="flex h-full max-h-full min-h-0 w-full items-center justify-center">
    <div
      class="flex h-fit max-h-full min-h-0 w-full max-w-[590px] flex-col overflow-hidden rounded-xl bg-card"
    >
      <ScrollArea type="auto" class="min-h-0 flex-1 overflow-hidden" viewport-class="min-h-0">
        <section class="flex w-full flex-col items-center p-4">
          <div class="relative w-full pb-16 sm:pb-20">
            <div
              class="relative aspect-[16/7] overflow-hidden rounded-lg border bg-card sm:aspect-[21/6]"
            >
              <img :src="image" :alt="title" class="size-full object-cover blur-xs" />
              <div
                class="pointer-events-none absolute inset-0 bg-linear-to-b from-transparent via-transparent to-background/35"
              ></div>
            </div>

            <div
              class="absolute bottom-0 left-1/2 flex h-36 w-40 -translate-x-1/2 items-end justify-center sm:h-44 sm:w-52"
              aria-hidden="true"
            >
              <img
                :src="vueHostUrl"
                alt=""
                class="relative z-10 mb-2 w-28 drop-shadow-2xl sm:w-36"
              />
            </div>
          </div>

          <div class="flex w-full flex-col items-center text-center">
            <div class="flex flex-wrap items-center justify-center gap-3">
              <span class="text-sm text-muted-foreground">{{ category }}</span>
              <ActivityLevelBadge :type="level" :text="$t(`general.levels.${level}`)" />
            </div>

            <h1 class="mt-4 text-2xl font-bold text-balance">
              {{ title }}
            </h1>

            <p class="mt-3 max-w-2xl text-pretty text-sm text-muted-foreground">
              {{ description }}
            </p>

            <div
              class="mt-7 flex w-full flex-col divide-y divide-border border-y text-sm sm:flex-row sm:divide-x sm:divide-y-0"
            >
              <div
                class="flex flex-1 items-center justify-between gap-4 py-3 sm:block sm:px-6 sm:py-4"
              >
                <span class="flex items-center gap-1.5 text-muted-foreground sm:justify-center">
                  <Icon name="mdi:help-circle-outline" class="size-4 shrink-0" />
                  {{ $t("quiz.total_questions") }}
                </span>
                <span class="font-bold sm:mt-1 sm:block">{{ numberOfQuestions }}</span>
              </div>

              <div
                class="flex flex-1 items-center justify-between gap-4 py-3 sm:block sm:px-6 sm:py-4"
              >
                <span class="flex items-center gap-1.5 text-muted-foreground sm:justify-center">
                  <Icon name="mdi:clock-outline" class="size-4 shrink-0" />
                  {{ $t("general.duration") }}
                </span>
                <span class="font-bold sm:mt-1 sm:block">{{ $t("quiz.quiz_duration") }}</span>
              </div>

              <div
                v-if="requiredPercentage !== undefined"
                class="flex flex-1 items-center justify-between gap-4 py-3 sm:block sm:px-6 sm:py-4"
              >
                <span class="flex items-center gap-1.5 text-muted-foreground sm:justify-center">
                  <Icon name="mdi:target" class="size-4 shrink-0" />
                  {{ $t("quiz.welcome.passingScore") }}
                </span>
                <span class="font-bold sm:mt-1 sm:block">
                  {{ $t("quiz.welcome.requiredPercentage", { percentage: requiredPercentage }) }}
                </span>
              </div>
            </div>
          </div>
        </section>
      </ScrollArea>

      <footer
        class="relative z-10 rounded-bl-xl rounded-br-xl flex shrink-0 justify-center border-t bg-card p-4 shadow-[0_-10px_24px_-14px_rgba(0,0,0,0.65)] sm:px-6"
      >
        <Button class="w-full sm:w-auto sm:min-w-72" size="xl" @click="$emit('startQuiz')">
          {{ $t("quiz.start_quiz") }}
          <Icon class="ms-1" name="mdi:arrow-right" size="24" />
        </Button>
      </footer>
    </div>
  </div>
</template>
