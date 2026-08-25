<script lang="ts" setup>
import { RotateCcwIcon } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const { t } = useI18n();

defineProps<{
  completedCount: number;
  progressPercent: number;
  totalCount: number;
}>();

const emit = defineEmits<{
  reset: [];
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

          <Dialog>
            <DialogTrigger as-child>
              <Button class="mt-4 w-full" variant="outline" :disabled="completedCount === 0">
                <RotateCcwIcon />
                {{ t("learningPath.progress.resetAction") }}
              </Button>
            </DialogTrigger>
            <DialogContent class="z-[1000]" overlay-class="z-[999]">
              <DialogHeader>
                <DialogTitle>{{ t("learningPath.progress.resetTitle") }}</DialogTitle>
                <DialogDescription>
                  {{ t("learningPath.progress.resetDescription") }}
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose as-child>
                  <Button variant="outline">
                    {{ t("learningPath.progress.resetCancel") }}
                  </Button>
                </DialogClose>
                <DialogClose as-child>
                  <Button variant="destructive" @click="emit('reset')">
                    {{ t("learningPath.progress.resetConfirm") }}
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<style lang="postcss" scoped></style>
