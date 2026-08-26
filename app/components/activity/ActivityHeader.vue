<script setup lang="ts">
import { AlertTriangleIcon, XIcon } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const props = withDefaults(
  defineProps<{
    title: string;
    backTo: string;
    warnBeforeLeave?: boolean;
  }>(),
  {
    warnBeforeLeave: false,
  },
);

const { t } = useI18n();
const leaveDialogOpen = ref(false);

async function leaveActivity() {
  leaveDialogOpen.value = false;
  await navigateTo(props.backTo);
}
</script>

<template>
  <header class="flex min-h-12 items-center justify-start border-b bg-background px-4 gap-2">
    <Button
      v-if="props.warnBeforeLeave"
      variant="ghost"
      size="icon-sm"
      :title="t('activity.leave')"
      :aria-label="t('activity.leave')"
      @click="leaveDialogOpen = true"
    >
      <XIcon />
    </Button>
    <Button
      v-else
      as-child
      variant="ghost"
      size="icon-sm"
      :title="t('activity.leave')"
      :aria-label="t('activity.leave')"
    >
      <NuxtLink :to="backTo">
        <XIcon />
      </NuxtLink>
    </Button>
    <h1 class="min-w-0 truncate text-sm font-semibold md:text-base">
      {{ title }}
    </h1>
  </header>

  <Dialog v-model:open="leaveDialogOpen">
    <DialogContent class="z-[1000]" overlay-class="z-[999]">
      <DialogHeader>
        <div
          class="mb-2 flex size-11 items-center justify-center rounded-full bg-destructive/10 text-destructive"
        >
          <AlertTriangleIcon class="size-6" />
        </div>
        <DialogTitle>{{ t("activity.leaveWarning.title") }}</DialogTitle>
        <DialogDescription>
          {{ t("activity.leaveWarning.description") }}
        </DialogDescription>
      </DialogHeader>

      <DialogFooter>
        <DialogClose as-child>
          <Button variant="outline">
            {{ t("activity.leaveWarning.cancel") }}
          </Button>
        </DialogClose>
        <Button variant="destructive" @click="leaveActivity">
          {{ t("activity.leaveWarning.confirm") }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
