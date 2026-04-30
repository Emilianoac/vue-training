<script lang="ts" setup>
import type { ItemType } from "@/schemas/learningPath.schema";
import { ArrowRightIcon, PlayCircleIcon, CheckCircleIcon } from "lucide-vue-next";
import useLearningPathData from "@/composables/learning-path/useLearningPathData";
import { useLearningPathProgress } from "@/composables/learning-path/useLearningPathProgress";
import IconTerminal from "@/components/assets/icons/IconTerminal.vue";
import IconQuiz from "@/components/assets/icons/IconQuiz.vue";
import IconBook from "@/components/assets/icons/IconBook.vue";

const props = defineProps<{
  pathId: string;
}>();

const { learningPath: test, getLearningPath } = useLearningPathData();

await getLearningPath(props.pathId);

const iconMap = {
  quiz: IconQuiz,
  challenge: IconTerminal,
  lesson: IconBook,
  tip: IconBook,
};

function getIcon(type: ItemType) {
  return iconMap[type] || IconBook;
}

const typeToSegment: Record<ItemType, string> = {
  lesson: "lessons",
  quiz: "quizzes",
  challenge: "challenges",
  tip: "tips",
};

function getActivityPath(type: ItemType, id: string) {
  return `/dashboard/learning-path/${props.pathId}/${typeToSegment[type]}/${id}`;
}

const { isCompleted, useProgress } = useLearningPathProgress();

const { allItems, completedCount, progressPercent } = useProgress(() => props.pathId, test);
</script>

<template>
  <div v-if="test">
    <!-- Progress Bar -->
    <div class="mb-8 space-y-2">
      <div class="flex items-center justify-between text-sm text-muted-foreground">
        <span class="font-medium">Progreso general</span>
        <span>{{ completedCount }} / {{ allItems.length }} completados</span>
      </div>
      <div class="h-3 w-full rounded-full bg-muted overflow-hidden">
        <div
          class="h-full rounded-full bg-green-500 transition-all duration-500"
          :style="{ width: progressPercent + '%' }"
        />
      </div>
      <p class="text-right text-xs text-muted-foreground">{{ progressPercent }}%</p>
    </div>
    <div v-for="(step, stepIndex) in test.steps" class="space-y-4">
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
          :class="
            (index + (stepIndex > 0 ? 1 : 0)) % 2 === 0
              ? 'justify-start pr-10 md:pr-20'
              : 'justify-end pl-10 md:pl-20'
          "
        >
          <div class="w-full md:w-[calc(50%-2.5rem)]">
            <Card
              :class="
                isCompleted(pathId, item.type, item.id).value
                  ? 'border-green-500 dark:border-green-600'
                  : ''
              "
            >
              <CardHeader class="pb-2">
                <div class="flex items-center gap-2 text-sm font-medium">
                  <div class="flex items-center justify-center size-10 rounded-full bg-background">
                    <component :is="getIcon(item.type)" class="size-4" />
                  </div>
                  <span>{{ item.type }}</span>
                </div>
                <div class="flex items-center justify-between gap-2">
                  <CardTitle class="text-base">{{ item.title }}</CardTitle>
                  <span
                    v-if="isCompleted(pathId, item.type, item.id).value"
                    class="text-xs font-medium text-green-600 dark:text-green-400 flex items-center gap-1"
                  >
                    <CheckCircleIcon class="size-3.5" /> Completado
                  </span>
                </div>
                <CardDescription>{{ item.subtitle }}</CardDescription>
              </CardHeader>
              <CardFooter class="pt-0">
                <NuxtLink
                  :to="getActivityPath(item.type, item.id)"
                  class="inline-flex items-center gap-1 text-sm text-primary font-medium hover:underline"
                >
                  <ArrowRightIcon class="size-4" />
                  Go to
                </NuxtLink>
              </CardFooter>
            </Card>
          </div>

          <div
            class="absolute left-1/2 top-8 -translate-x-1/2 size-12 rounded-full border-4 border-background flex items-center justify-center text-white"
            :class="
              isCompleted(pathId, item.type, item.id).value ? 'bg-green-500' : 'bg-muted-foreground'
            "
          >
            <CheckCircleIcon v-if="isCompleted(pathId, item.type, item.id).value" class="size-5" />
            <PlayCircleIcon v-else class="size-5" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
