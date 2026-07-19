<script setup lang="ts">
import { CheckIcon, Loader2Icon, PlayIcon, RefreshCwIcon } from "lucide-vue-next";
import { useMediaQuery } from "@vueuse/core";
import { useWebContainerRunner } from "@/lib/challenge-runners/webcontainer/composables/useWebContainerRunner";
import { hasPreparedSnapshotHint } from "@/lib/challenge-runners/webcontainer/services/snapshotCache";
import { WEB_CONTAINER_TEMPLATE_VERSION } from "@/lib/challenge-runners/webcontainer/template";
import CodeMirrorEditor from "./CodeMirrorEditor.client.vue";
import ChallengeSetupOverlay from "./ChallengeSetupOverlay.vue";
import ChallengeTerminal from "./ChallengeTerminal.client.vue";
import ChallengeTestResults from "./ChallengeTestResults.vue";
import ChallengeToolbar from "./ChallengeToolbar.vue";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  activeFilePath,
  canLoadPreview,
  canLoadCompleteSolution,
  canLoadSolution,
  canResetCode,
  canRunTests,
  canSaveCode,
  code,
  dirtyFilePaths,
  editableFiles,
  isReady,
  isFirstSetupLoading,
  isPreviewStarting,
  isRunning,
  loadPreview,
  loadCompleteSolution,
  loadSolution,
  previewFrameKey,
  previewUrl,
  resetCode,
  runTests,
  saveCode,
  saveFeedback,
  selectFile,
  setupLabel,
  solutionFiles,
  terminalOutput,
  testCases,
  testSummary,
} = useWebContainerRunner(props.challengeId);

const emit = defineEmits<{
  completed: [];
}>();

const activeEditorTab = ref("editor");
const activeSolutionPath = ref("");
const activeSolutionFile = computed(() =>
  solutionFiles.find((file) => file.path === activeSolutionPath.value),
);
const isDesktop = useMediaQuery("(min-width: 1024px)");
const isFullscreen = ref(false);
const showSetupOverlay = ref(!hasPreparedSnapshotHint(WEB_CONTAINER_TEMPLATE_VERSION));
const showSolutionDialog = ref(false);
const runnerRoot = ref<HTMLElement | null>(null);
let setupOverlayTimer: number | undefined;

watch(
  () => testSummary.value,
  (summary) => {
    if (summary.total > 0 && summary.failed === 0) emit("completed");
  },
);

watch(activeEditorTab, (tab) => {
  if (tab === "preview") void loadPreview();
});

watch(isFirstSetupLoading, (isLoading) => {
  if (isLoading) {
    if (setupOverlayTimer) window.clearTimeout(setupOverlayTimer);
    setupOverlayTimer = window.setTimeout(() => {
      if (isFirstSetupLoading.value) showSetupOverlay.value = true;
    }, 500);
    return;
  }

  if (setupOverlayTimer) window.clearTimeout(setupOverlayTimer);
  showSetupOverlay.value = false;
});

onMounted(() => {
  document.addEventListener("fullscreenchange", syncFullscreenState);
});

onBeforeUnmount(() => {
  document.removeEventListener("fullscreenchange", syncFullscreenState);
  if (setupOverlayTimer) window.clearTimeout(setupOverlayTimer);
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

function applySolution() {
  loadSolution(activeSolutionPath.value);
  selectFile(activeSolutionPath.value);
  showSolutionDialog.value = false;
}

function applyCompleteSolution() {
  loadCompleteSolution();
  showSolutionDialog.value = false;
}

function openSolutionDialog() {
  activeSolutionPath.value = solutionFiles.some((file) => file.path === activeFilePath.value)
    ? activeFilePath.value
    : (solutionFiles[0]?.path ?? "");
  showSolutionDialog.value = true;
}
</script>

<template>
  <ClientOnly>
    <div
      ref="runnerRoot"
      class="relative flex min-h-0 flex-col overflow-hidden rounded-sm border border-(--editor-panel-border)"
      :class="isFullscreen ? 'h-dvh bg-(--editor-background)' : 'h-full'"
    >
      <ChallengeToolbar
        :active-file-path="activeFilePath"
        :can-load-solution="canLoadSolution"
        :can-reset-code="canResetCode"
        :can-save-code="canSaveCode"
        :dirty-file-paths="dirtyFilePaths"
        :files="editableFiles"
        :is-fullscreen="isFullscreen"
        @reset-code="resetCode"
        @save-code="saveCode"
        @select-file="selectFile"
        @toggle-fullscreen="toggleFullscreen"
        @view-solution="openSolutionDialog"
      />

      <ResizablePanelGroup direction="vertical" class="min-h-0 flex-1">
        <ResizablePanel :default-size="70" :min-size="20" class="min-h-0">
          <Tabs v-model="activeEditorTab" class="h-full min-h-0 gap-0">
            <TabsContent
              value="editor"
              class="relative m-0 h-full min-h-0 data-[state=inactive]:hidden"
            >
              <CodeMirrorEditor :key="activeFilePath" v-model="code" :on-save="saveCode" />
              <div
                class="absolute right-4 bottom-4 z-10 flex gap-2 rounded-md bg-(--editor-panel-background) p-2 shadow-(--editor-panel-shadow)"
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
                  <Button
                    size="sm"
                    variant="outline"
                    :disabled="!canLoadPreview"
                    @click="loadPreview"
                  >
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

        <ResizablePanel :default-size="30" :min-size="0" class="min-h-0">
          <ResizablePanelGroup :direction="isDesktop ? 'horizontal' : 'vertical'" class="min-h-0">
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

      <ChallengeSetupOverlay v-if="showSetupOverlay" :complete="isReady" :stage="setupLabel" />

      <Dialog v-model:open="showSolutionDialog">
        <DialogContent
          class="flex max-h-[85dvh] w-[min(96vw,1200px)] max-w-none flex-col overflow-hidden p-0 sm:max-w-[1200px]"
          @close-auto-focus.prevent
        >
          <DialogHeader class="border-b border-(--editor-panel-border) px-5 pt-4">
            <DialogTitle>{{ t("challenge.runner.solution.title") }}</DialogTitle>
            <DialogDescription>
              {{ t("challenge.runner.solution.description") }}
            </DialogDescription>

            <Tabs v-model="activeSolutionPath" class="mt-2 gap-0">
              <TabsList class="h-auto justify-start rounded-none bg-transparent p-0">
                <TabsTrigger
                  v-for="file in solutionFiles"
                  :key="file.path"
                  class="rounded-none border-b-2 border-transparent px-3 py-2 text-xs data-[state=active]:border-(--editor-panel-tab-accent) data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                  :value="file.path"
                >
                  {{ file.label }}
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </DialogHeader>

          <div class="min-h-0 flex-1 basis-[55dvh] bg-(--editor-background)">
            <CodeMirrorEditor
              v-if="activeSolutionFile"
              :key="activeSolutionFile.path"
              :model-value="activeSolutionFile.solution"
              readonly
            />
          </div>

          <DialogFooter class="shrink-0 border-t border-(--editor-panel-border) px-5 py-4">
            <Button variant="outline" :disabled="!canLoadSolution" @click="applySolution">
              {{ t("challenge.runner.actions.loadSolution") }}
            </Button>
            <Button
              v-if="solutionFiles.length > 1"
              :disabled="!canLoadCompleteSolution"
              @click="applyCompleteSolution"
            >
              {{ t("challenge.runner.actions.loadCompleteSolution") }}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>

    <template #fallback>
      <div
        class="h-[430px] rounded-md border border-(--editor-panel-border) bg-(--editor-background)"
      />
    </template>
  </ClientOnly>
</template>
