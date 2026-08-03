<script lang="ts" setup>
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const { t } = useI18n();

defineProps<{
  completedCount: number;
  progressPercent: number;
  totalCount: number;
}>();
</script>

<template>
  <div class="space-y-2">
    <Card class="gap-3">
      <CardHeader>
        <CardTitle>{{ t("learningPath.progress.title") }}</CardTitle>
      </CardHeader>
      <CardContent>
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-sm text-muted-foreground block">
              {{ t("learningPath.progress.completed", { completedCount, totalCount }) }}
            </span>
            <p class="text-right text-xs text-muted-foreground">{{ progressPercent }}%</p>
          </div>

          <div class="h-3 w-full rounded-full bg-muted overflow-hidden">
            <div
              class="h-full rounded-full bg-green-500 transition-all duration-500"
              :style="{ width: progressPercent + '%' }"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<style lang="postcss" scoped></style>
