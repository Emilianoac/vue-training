<script setup lang="ts">
import type { TestCaseResult, TestSummary } from "@/lib/challenge-runners/webcontainer/types";
import ChallengeTerminal from "./ChallengeTerminal.client.vue";
import ChallengeTestResults from "./ChallengeTestResults.vue";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";

const props = defineProps<{
  isDesktop: boolean;
  terminalOutput: string;
  testCases: TestCaseResult[];
  testSummary: TestSummary;
}>();
</script>

<template>
  <ResizablePanelGroup :direction="props.isDesktop ? 'horizontal' : 'vertical'" class="min-h-0">
    <ResizablePanel
      :default-size="props.isDesktop ? 65 : 55"
      :min-size="props.isDesktop ? 35 : 30"
      class="min-h-0"
    >
      <ChallengeTerminal :output="props.terminalOutput" />
    </ResizablePanel>

    <ResizableHandle
      class="bg-(--editor-panel-border) data-[resize-handle-state=drag]:outline-3 data-[resize-handle-state=drag]:outline-[color-mix(in_oklch,var(--editor-panel-tab-accent)_40%,transparent)]"
      :with-handle="true"
    />

    <ResizablePanel
      :default-size="props.isDesktop ? 35 : 45"
      :min-size="props.isDesktop ? 25 : 30"
      class="min-h-0"
    >
      <ChallengeTestResults
        :failed="props.testSummary.failed"
        :passed="props.testSummary.passed"
        :tests="props.testCases"
        :total="props.testSummary.total"
      />
    </ResizablePanel>
  </ResizablePanelGroup>
</template>
