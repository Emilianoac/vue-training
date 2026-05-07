<script lang="ts" setup>
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
        <CardTitle> Progreso general </CardTitle>
      </CardHeader>
      <CardContent>
        <div class="space-y-1">
          <span class="text-sm text-muted-foreground block">
            {{ completedCount }} / {{ totalCount }} completados
          </span>

          <div class="h-3 w-full rounded-full bg-muted overflow-hidden">
            <div
              class="h-full rounded-full bg-green-500 transition-all duration-500"
              :style="{ width: progressPercent + '%' }"
            />
          </div>
          <p class="text-right text-xs text-muted-foreground">{{ progressPercent }}%</p>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<style lang="postcss" scoped></style>
