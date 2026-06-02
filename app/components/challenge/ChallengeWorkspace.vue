<script setup lang="ts">
import type { Challenge } from "@/schemas/challenge.schema";
import { CheckCircleIcon } from "lucide-vue-next";
import ChallengeRunner from "@/components/challenge/challenge-runner/ChallengeRunner.vue";
import ChipComponent from "@/components/ui/ChipComponent.vue";
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
  <ResizablePanelGroup direction="horizontal" class="flex-1">
    <ResizablePanel :default-size="30" :min-size="20" class="pr-4">
      <ScrollArea class="h-full pr-4">
        <aside class="h-full overflow-auto">
          <ChipComponent
            class="mb-3"
            :type="props.challenge.level"
            :text="t(`general.levels.${props.challenge.level}`)"
          />
          <h1 class="mb-2 text-2xl font-bold">{{ props.challenge.title }}</h1>

          <p
            v-for="paragraph in props.challenge.description"
            :key="paragraph"
            class="mb-2 text-sm last-of-type:mb-0"
          >
            {{ paragraph }}
          </p>

          <hr class="my-8 h-px border-0 bg-gray-300 dark:bg-gray-700" />

          <h2 class="font-bold">{{ t("challenge.description.instructions") }}</h2>
          <ol
            class="mt-2 list-inside list-decimal rounded-md bg-slate-100 p-4 text-sm text-gray-900 dark:bg-slate-800/50 dark:text-gray-300"
          >
            <li
              v-for="instruction in props.challenge.instructions"
              :key="instruction"
              class="mb-4 last-of-type:mb-0"
            >
              {{ instruction }}
            </li>
          </ol>

          <template v-if="props.challenge.hints.length">
            <hr class="my-8 h-px border-0 bg-gray-300 dark:bg-gray-700" />

            <h2 class="font-bold">{{ t("challenge.description.hints") }}</h2>
            <ul class="mt-2 space-y-3">
              <li
                v-for="hint in props.challenge.hints"
                :key="hint.title"
                class="rounded-md border bg-card p-4 text-sm"
              >
                <h3 class="font-semibold text-foreground">{{ hint.title }}</h3>
                <p class="mt-1 text-muted-foreground">{{ hint.body }}</p>
              </li>
            </ul>
          </template>
        </aside>
      </ScrollArea>
    </ResizablePanel>

    <ResizableHandle
      class="bg-(--editor-panel-border) data-[resize-handle-state=drag]:outline-3 data-[resize-handle-state=drag]:outline-[color-mix(in_oklch,var(--editor-panel-tab-accent)_40%,transparent)]"
    />

    <ResizablePanel :default-size="70" :min-size="60" class="pl-4">
      <ChallengeRunner :challenge-id="props.challenge.documentId" @completed="handleCompleted" />
    </ResizablePanel>
  </ResizablePanelGroup>

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
