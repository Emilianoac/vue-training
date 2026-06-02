<script setup lang="ts">
import { CheckIcon, Loader2Icon, PlayIcon, RefreshCwIcon } from "lucide-vue-next";
import { useMediaQuery } from "@vueuse/core";
import { useWebContainerRunner } from "@/lib/challenge-runners/webcontainer/composables/useWebContainerRunner";
import CodeMirrorEditor from "./CodeMirrorEditor.client.vue";
import ChallengeTerminal from "./ChallengeTerminal.client.vue";
import ChallengeTestResults from "./ChallengeTestResults.vue";
import ChallengeToolbar from "./ChallengeToolbar.vue";
import { Button } from "@/components/ui/button";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const props = withDefaults(
  defineProps<{
    challengeId?: string;
  }>(),
  {
    challengeId: "ref-counter-state",
  },
);

const { t } = useI18n();

const {
  activeFileIcon,
  activeFileLabel,
  canLoadPreview,
  canLoadSolution,
  canResetCode,
  canRunTests,
  canSaveCode,
  code,
  isReady,
  isPreviewStarting,
  isRunning,
  loadPreview,
  loadSolution,
  previewFrameKey,
  previewUrl,
  resetCode,
  runTests,
  saveCode,
  saveFeedback,
  setupLabel,
  terminalOutput,
  testCases,
  testSummary,
} = useWebContainerRunner(props.challengeId);

const emit = defineEmits<{
  completed: [];
}>();

const activeEditorTab = ref("editor");
const isDesktop = useMediaQuery("(min-width: 1024px)");
const isFullscreen = ref(false);
const runnerRoot = ref<HTMLElement | null>(null);

watch(
  () => testSummary.value,
  (summary) => {
    if (summary.total > 0 && summary.failed === 0) emit("completed");
  },
);

watch(activeEditorTab, (tab) => {
  if (tab === "preview") void loadPreview();
});

onMounted(() => {
  document.addEventListener("fullscreenchange", syncFullscreenState);
});

onBeforeUnmount(() => {
  document.removeEventListener("fullscreenchange", syncFullscreenState);
});

async function toggleFullscreen() {
  const root = runnerRoot.value;
  if (!root) return;

  if (document.fullscreenElement === root) {
    await document.exitFullscreen();
    return;
  }

  await root.requestFullscreen();
}

function syncFullscreenState() {
  isFullscreen.value = document.fullscreenElement === runnerRoot.value;
}
</script>

<template>
  <ClientOnly>
    <div
      ref="runnerRoot"
      class="flex min-h-0 flex-col overflow-hidden rounded-sm border border-(--editor-panel-border)"
      :class="isFullscreen ? 'h-dvh bg-(--editor-background)' : 'h-full'"
    >
      <ChallengeToolbar
        :can-load-solution="canLoadSolution"
        :can-reset-code="canResetCode"
        :can-save-code="canSaveCode"
        :file-icon="activeFileIcon"
        :file-label="activeFileLabel"
        :is-fullscreen="isFullscreen"
        @load-solution="loadSolution"
        @reset-code="resetCode"
        @save-code="saveCode"
        @toggle-fullscreen="toggleFullscreen"
      />

      <ResizablePanelGroup direction="vertical" class="min-h-0 flex-1">
        <ResizablePanel :default-size="70" :min-size="20" class="min-h-0">
          <Tabs v-model="activeEditorTab" class="h-full min-h-0 gap-0">
            <TabsContent
              value="editor"
              class="relative m-0 h-full min-h-0 data-[state=inactive]:hidden"
            >
              <CodeMirrorEditor v-model="code" :on-save="saveCode" />
              <div
                class="absolute right-4 bottom-4 z-99 flex gap-2 rounded-md bg-(--editor-panel-background) p-2 shadow-(--editor-panel-shadow)"
              >
                <Button :disabled="!canRunTests" @click="runTests">
                  <template v-if="isRunning">
                    {{ t("challenge.runner.actions.runningTests") }}
                    <Loader2Icon class="animate-spin" />
                  </template>
                  <template v-else>
                    {{ t("challenge.runner.actions.runTests") }}
                    <PlayIcon />
                  </template>
                </Button>
              </div>
            </TabsContent>

            <TabsContent
              value="preview"
              class="m-0 h-full min-h-0 bg-(--editor-background) data-[state=inactive]:hidden"
            >
              <div class="flex h-full min-h-0 flex-col">
                <div class="flex justify-end border-b border-(--editor-panel-border) p-2">
                  <Button size="sm" variant="outline" :disabled="!canLoadPreview" @click="loadPreview">
                    <template v-if="isPreviewStarting">
                      {{ t("challenge.runner.actions.loadingPreview") }}
                      <Loader2Icon class="animate-spin" />
                    </template>
                    <template v-else>
                      {{ t("challenge.runner.actions.reloadPreview") }}
                      <RefreshCwIcon />
                    </template>
                  </Button>
                </div>

                <iframe
                  v-if="previewUrl"
                  :key="previewFrameKey"
                  class="min-h-0 flex-1 bg-white"
                  :src="previewUrl"
                  :title="t('challenge.runner.preview.title')"
                />

                <div
                  v-else
                  class="flex min-h-0 flex-1 items-center justify-center p-6 text-sm text-muted-foreground"
                >
                  {{
                    isPreviewStarting
                      ? t("challenge.runner.preview.loading")
                      : t("challenge.runner.preview.empty")
                  }}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </ResizablePanel>

        <ResizableHandle
          class="bg-(--editor-panel-border) data-[resize-handle-state=drag]:outline-3 data-[resize-handle-state=drag]:outline-[color-mix(in_oklch,var(--editor-panel-tab-accent)_40%,transparent)]"
          :with-handle="true"
        />

        <ResizablePanel :default-size="30" :min-size="30" class="min-h-0">
          <ResizablePanelGroup
            :direction="isDesktop ? 'horizontal' : 'vertical'"
            class="min-h-0"
          >
            <ResizablePanel
              :default-size="isDesktop ? 65 : 55"
              :min-size="isDesktop ? 35 : 30"
              class="min-h-0"
            >
              <ChallengeTerminal :output="terminalOutput" />
            </ResizablePanel>

            <ResizableHandle
              class="bg-(--editor-panel-border) data-[resize-handle-state=drag]:outline-3 data-[resize-handle-state=drag]:outline-[color-mix(in_oklch,var(--editor-panel-tab-accent)_40%,transparent)]"
              :with-handle="true"
            />

            <ResizablePanel
              :default-size="isDesktop ? 35 : 45"
              :min-size="isDesktop ? 25 : 30"
              class="min-h-0"
            >
              <ChallengeTestResults
                :failed="testSummary.failed"
                :passed="testSummary.passed"
                :tests="testCases"
                :total="testSummary.total"
              />
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
      <footer
        class="flex items-center justify-between border-(--editor-panel-border) bg-(--editor-panel-surface-background) p-2"
      >
        <Tabs v-model="activeEditorTab">
          <TabsList class="h-7 rounded-sm bg-(--editor-panel-background)">
            <TabsTrigger class="rounded-sm px-3 text-xs" value="editor">
              {{ t("challenge.runner.tabs.editor") }}
            </TabsTrigger>
            <TabsTrigger class="rounded-sm px-3 text-xs" value="preview">
              {{ t("challenge.runner.tabs.preview") }}
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div class="flex items-center gap-1">
          <CheckIcon v-if="isReady" :size="10" />
          <Loader2Icon v-else class="animate-spin" :size="10" />
          <span class="text-xs text-muted-foreground">
            {{ saveFeedback || setupLabel }}
          </span>
        </div>
      </footer>
    </div>

    <template #fallback>
      <div
        class="h-[430px] rounded-md border border-(--editor-panel-border) bg-(--editor-background)"
      />
    </template>
  </ClientOnly>
</template>
