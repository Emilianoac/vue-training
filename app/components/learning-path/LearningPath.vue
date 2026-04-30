<script lang="ts" setup>
import type { ItemType } from "@/schemas/learningPath.schema";
import { ArrowRightIcon, PlayCircleIcon } from "lucide-vue-next";
import useLearningPathData from "@/composables/learning-path/useLearningPathData";
import IconTerminal from "@/components/assets/icons/IconTerminal.vue";
import IconQuiz from "@/components/assets/icons/IconQuiz.vue";
import IconBook from "@/components/assets/icons/IconBook.vue";

const { learningPath: test, getLearningPath } = useLearningPathData();

await getLearningPath("vue-3-path");

const iconMap = {
  quiz: IconQuiz,
  challenge: IconTerminal,
  lesson: IconBook,
  tip: IconBook,
};

function getIcon(type: ItemType) {
  return iconMap[type] || IconBook;
}
</script>

<template>
  <div v-if="test">
    <div v-for="step in test.steps" class="space-y-4">
      <!-- Step Title -->
      <div class="flex items-center justify-center gap-6">
        <hr class="border w-full" />
        <h2 class="text-lg font-semibold text-center whitespace-nowrap">{{ step.name }}</h2>
        <hr class="w-full" />
      </div>

      <div class="relative mx-auto max-w-4xl">
        <!-- Vertical Line -->
        <div class="absolute left-1/2 top-6 bottom-10 w-1 -translate-x-1/2 rounded-full bg-muted" />

        <div
          v-for="(item, index) in step.items"
          :key="item.title"
          class="relative mb-6 flex"
          :class="index % 2 === 0 ? 'justify-start pr-10 md:pr-20' : 'justify-end pl-10 md:pl-20'"
        >
          <div class="w-full md:w-[calc(50%-2.5rem)]">
            <Card>
              <CardHeader class="pb-2">
                <div class="flex items-center gap-2 text-sm font-medium">
                  <div class="flex items-center justify-center size-10 rounded-full bg-background">
                    <component :is="getIcon(item.type)" class="size-4" />
                  </div>
                  <span>{{ item.type }}</span>
                </div>
                <div class="flex items-center justify-between gap-2">
                  <CardTitle class="text-base">{{ item.title }}</CardTitle>
                </div>
                <CardDescription>{{ item.subtitle }}</CardDescription>
              </CardHeader>
              <CardFooter class="pt-0">
                <NuxtLink
                  :to="`/dashboard${item.path}`"
                  class="inline-flex items-center gap-1 text-sm text-primary font-medium hover:underline"
                >
                  <ArrowRightIcon class="size-4" />
                  Go to
                </NuxtLink>
              </CardFooter>
            </Card>
          </div>

          <div
            class="absolute left-1/2 top-8 -translate-x-1/2 size-12 rounded-full border-4 border-background flex items-center justify-center bg-green-500 text-white"
          >
            <PlayCircleIcon class="size-5" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
