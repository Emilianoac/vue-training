<script lang="ts" setup>
import type { ItemType } from "@/schemas/learningPath.schema";
import useLearningPathData from "@/composables/learning-path/useLearningPathData";
import {
  consumeLearningPathSection,
  createActivityPath,
  rememberLearningPathSection,
} from "@/composables/learning-path/useLearningPathNavigation";
import { useLearningPathProgress } from "@/composables/learning-path/useLearningPathProgress";
import PathItem from "./PathItem.vue";
import PathProgress from "./PathProgress.vue";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const props = defineProps<{
  pathId: string;
}>();

const { locale } = useI18n();
const { learningPath, getLearningPath } = useLearningPathData();

await getLearningPath(props.pathId);

const { isCompleted, useProgress } = useLearningPathProgress();
const { allItems, completedCount, progressPercent } = useProgress(() => props.pathId, learningPath);

function getActivityPath(type: ItemType, id: string) {
  return createActivityPath(props.pathId, type, id);
}

function isPlannedSubStep(subStep: { status?: string; items?: unknown[] }) {
  return subStep.status === "planned" || !subStep.items?.length;
}

function isPlannedStep(step: { sub_steps: Array<{ status?: string; items?: unknown[] }> }) {
  return step.sub_steps.every(isPlannedSubStep);
}

watch(locale, async () => {
  await getLearningPath(props.pathId);
});

onMounted(() => {
  scrollToSection(consumeLearningPathSection(props.pathId));
});

async function scrollToSection(sectionId: string | null) {
  if (!sectionId) return;

  await nextTick();
  window.requestAnimationFrame(() => {
    document.getElementById(sectionId)?.scrollIntoView({ block: "start" });
  });
}
</script>

<template>
  <div v-if="learningPath" class="space-y-4">
    <div class="grid grid-cols-1 xl:grid-cols-[1fr_450px] gap-6">
      <div class="order-1 xl:order-0">
        <h1 class="text-center md:text-start text-xl font-bold mb-8">{{ learningPath.title }}</h1>
        <div v-for="step in learningPath.steps" class="space-y-4">
          <!-- Step Title -->
          <div class="flex items-center justify-center gap-6">
            <hr class="border w-full" />
            <div class="flex items-center gap-2">
              <h2 class="text-xl font-semibold text-center whitespace-nowrap">{{ step.name }}</h2>
              <Badge v-if="isPlannedStep(step)" variant="secondary">
                {{ $t("learningPath.status.planned") }}
              </Badge>
            </div>
            <hr class="w-full" />
          </div>

          <!--Step -->
          <div class="mx-auto my-10 space-y-6">
            <div
              v-for="(subStep, index) in step.sub_steps"
              :id="subStep.id"
              :key="subStep.id"
              class="scroll-mt-4"
            >
              <div
                class="mb-2 flex items-center justify-center gap-2"
                :class="{ 'opacity-60': isPlannedSubStep(subStep) }"
              >
                <h3 class="whitespace-nowrap text-center">{{ subStep.name }}</h3>
              </div>
              <Card
                v-if="isPlannedSubStep(subStep)"
                class="border-dashed bg-muted/30 text-muted-foreground opacity-60"
              >
                <CardHeader>
                  <CardTitle class="text-base">{{ subStep.name }}</CardTitle>
                  <CardDescription>
                    {{ $t("learningPath.plannedDescription") }}
                  </CardDescription>
                </CardHeader>
              </Card>
              <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <PathItem
                  v-for="item in subStep.items"
                  :key="item.id"
                  :item="item"
                  class="lg:first-of-type:col-span-2"
                  :is-completed="isCompleted(pathId, item.type, item.id).value"
                  :path="getActivityPath(item.type, item.id)"
                  @select="rememberLearningPathSection(pathId, subStep.id)"
                />
              </div>
              <hr v-if="index !== step.sub_steps.length - 1" class="my-10" />
            </div>
          </div>
        </div>
      </div>

      <div class="order-0 xl:order-1">
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
