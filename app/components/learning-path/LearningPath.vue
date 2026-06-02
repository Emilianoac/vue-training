<script lang="ts" setup>
import type { ItemType } from "@/schemas/learningPath.schema";
import useLearningPathData from "@/composables/learning-path/useLearningPathData";
import { useLearningPathProgress } from "@/composables/learning-path/useLearningPathProgress";
import PathItem from "./PathItem.vue";
import PathProgress from "./PathProgress.vue";

const props = defineProps<{
  pathId: string;
}>();

const { locale } = useI18n();
const { learningPath, getLearningPath } = useLearningPathData();

await getLearningPath(props.pathId);

const typeToSegment: Record<ItemType, string> = {
  lesson: "lessons",
  quiz: "quizzes",
  challenge: "challenges",
  tip: "tips",
};

const { isCompleted, useProgress } = useLearningPathProgress();
const { allItems, completedCount, progressPercent } = useProgress(() => props.pathId, learningPath);

function getActivityPath(type: ItemType, id: string) {
  return `/learn/learning-path/${props.pathId}/${typeToSegment[type]}/${id}`;
}

watch(locale, async () => {
  await getLearningPath(props.pathId);
});
</script>

<template>
  <div v-if="learningPath">
    <div class="grid grid-cols-[1fr_400px] gap-6">
      <div>
        <div v-for="step in learningPath.steps" class="space-y-4">
          <!-- Step Title -->
          <div class="flex items-center justify-center gap-6">
            <hr class="border w-full" />
            <h2 class="text-xl font-semibold text-center whitespace-nowrap">{{ step.name }}</h2>
            <hr class="w-full" />
          </div>

          <!--Step -->
          <div class="mx-auto max-w-175 my-10 space-y-6">
            <div v-for="(subStep, index) in step.sub_steps" :key="subStep.name">
              <h3 class="whitespace-nowrap mb-2 text-center">{{ subStep.name }}</h3>
              <div class="grid grid-cols-3 gap-4">
                <PathItem
                  v-for="item in subStep.items"
                  :key="item.id"
                  :item="item"
                  class="first-of-type:col-span-3"
                  :is-completed="isCompleted(pathId, item.type, item.id).value"
                  :path="getActivityPath(item.type, item.id)"
                />
              </div>
              <hr v-if="index !== step.sub_steps.length - 1" class="my-10" />
            </div>
          </div>
        </div>
      </div>

      <div>
        <aside class="sticky top-0">
          <PathProgress
            :total-count="allItems.length"
            :completed-count="completedCount"
            :progress-percent="progressPercent"
          />
        </aside>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
