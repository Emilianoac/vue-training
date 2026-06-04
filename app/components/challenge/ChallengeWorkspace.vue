<script setup lang="ts">
import type { Challenge } from "@/schemas/challenge.schema";
import { useMediaQuery } from "@vueuse/core";
import { CheckCircleIcon } from "lucide-vue-next";
import ChallengeDescription from "@/components/challenge/ChallengeDescription.vue";
import ChallengeRunner from "@/components/challenge/challenge-runner/ChallengeRunner.vue";
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
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";

const props = defineProps<{
  challenge: Challenge;
  continueLabel?: string;
}>();

const emit = defineEmits<{
  completed: [];
  continue: [];
}>();

const { t } = useI18n();
const isDesktop = useMediaQuery("(min-width: 1024px)");
const completionDialogOpen = ref(false);
const hasCompleted = ref(false);

function handleCompleted() {
  completionDialogOpen.value = true;

  if (!hasCompleted.value) {
    hasCompleted.value = true;
    emit("completed");
  }
}
</script>

<template>
  <ResizablePanelGroup v-if="isDesktop" direction="horizontal" class="flex-1">
    <ResizablePanel :default-size="30" :min-size="20" class="pr-4">
      <ScrollArea class="h-full pr-4">
        <ChallengeDescription :challenge="props.challenge" :show-title="false" />
      </ScrollArea>
    </ResizablePanel>

    <ResizableHandle
      class="bg-(--editor-panel-border) data-[resize-handle-state=drag]:outline-3 data-[resize-handle-state=drag]:outline-[color-mix(in_oklch,var(--editor-panel-tab-accent)_40%,transparent)]"
    />

    <ResizablePanel :default-size="70" :min-size="60" class="pl-4">
      <ChallengeRunner :challenge-id="props.challenge.documentId" @completed="handleCompleted" />
    </ResizablePanel>
  </ResizablePanelGroup>

  <div v-else class="flex flex-col gap-4">
    <section class="rounded-md border bg-card p-4">
      <ChallengeDescription :challenge="props.challenge" :show-title="false" />
    </section>
    <div class="h-[calc(100dvh-7rem)] min-h-[640px]">
      <ChallengeRunner :challenge-id="props.challenge.documentId" @completed="handleCompleted" />
    </div>
  </div>

  <Dialog v-model:open="completionDialogOpen">
    <DialogContent>
      <DialogHeader>
        <div
          class="mb-2 flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary"
        >
          <CheckCircleIcon class="size-6" />
        </div>
        <DialogTitle>{{ t("challenge.completion.title") }}</DialogTitle>
        <DialogDescription>
          {{ t("challenge.completion.message") }}
        </DialogDescription>
      </DialogHeader>

      <DialogFooter>
        <Button v-if="props.continueLabel" @click="emit('continue')">
          {{ props.continueLabel }}
        </Button>
        <DialogClose as-child>
          <Button variant="outline">
            {{ t("challenge.completion.close") }}
          </Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
