<script setup lang="ts">
import { useMediaQuery } from "@vueuse/core";
import { useWebContainerRunner } from "@/lib/challenge-runners/webcontainer/composables/useWebContainerRunner";
import { hasPreparedSnapshotHint } from "@/lib/challenge-runners/webcontainer/services/snapshotCache";
import { WEB_CONTAINER_TEMPLATE_VERSION } from "@/lib/challenge-runners/webcontainer/template";
import ChallengeCodeViewerDialog from "./ChallengeCodeViewerDialog.vue";
import ChallengeEditorPanel from "./ChallengeEditorPanel.vue";
import ChallengeOutputPanel from "./ChallengeOutputPanel.vue";
import ChallengeRunnerFooter from "./ChallengeRunnerFooter.vue";
import ChallengeSetupOverlay from "./ChallengeSetupOverlay.vue";
import ChallengeStaticModeBanner from "./ChallengeStaticModeBanner.vue";
import ChallengeToolbar from "./ChallengeToolbar.vue";
import { Button } from "@/components/ui/button";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";

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
  hasCodeChanges,
  isReady,
  isStaticMode,
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
  initializeContainer,
  runnerError,
  solutionFiles,
  terminalOutput,
  testCases,
  testFiles,
  testSummary,
} = useWebContainerRunner(props.challengeId);

const emit = defineEmits<{
  completed: [method: "tests" | "manual"];
  progressChange: [hasProgress: boolean];
}>();

const activeEditorTab = ref("editor");
const activeSolutionPath = ref("");
const solutionViewerFiles = computed(() =>
  solutionFiles.map(({ icon, label, path, solution }) => ({
    content: solution,
    icon,
    label,
    path,
  })),
);
const activeTestPath = ref("");
const isDesktop = useMediaQuery("(min-width: 1024px)");
const isFullscreen = ref(false);
const showSetupOverlay = ref(!hasPreparedSnapshotHint(WEB_CONTAINER_TEMPLATE_VERSION));
const showSolutionDialog = ref(false);
const showTestsDialog = ref(false);
const runnerRoot = ref<HTMLElement | null>(null);
let setupOverlayTimer: number | undefined;

watch(
  () => testSummary.value,
  (summary) => {
    if (summary.total > 0 && summary.failed === 0) emit("completed", "tests");
  },
);

watch(
  hasCodeChanges,
  (hasProgress) => {
    emit("progressChange", hasProgress);
  },
  { immediate: true },
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

watch(isStaticMode, (staticMode) => {
  if (!staticMode) return;

  if (setupOverlayTimer) window.clearTimeout(setupOverlayTimer);
  showSetupOverlay.value = false;
  activeEditorTab.value = "editor";
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

function openTestsDialog() {
  activeTestPath.value = testFiles[0]?.path ?? "";
  showTestsDialog.value = true;
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
        :can-view-tests="testFiles.length > 0"
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
        @view-tests="openTestsDialog"
      />

      <ChallengeStaticModeBanner
        v-if="isStaticMode"
        :runner-error="runnerError"
        @completed="emit('completed', 'manual')"
        @retry="initializeContainer"
      />

      <ResizablePanelGroup direction="vertical" class="min-h-0 flex-1">
        <ResizablePanel :default-size="70" :min-size="20" class="min-h-0">
          <ChallengeEditorPanel
            v-model:active-tab="activeEditorTab"
            v-model:code="code"
            :active-file-path="activeFilePath"
            :can-load-preview="canLoadPreview"
            :can-run-tests="canRunTests"
            :is-preview-starting="isPreviewStarting"
            :is-running="isRunning"
            :is-static-mode="isStaticMode"
            :on-save="saveCode"
            :preview-frame-key="previewFrameKey"
            :preview-url="previewUrl"
            @load-preview="loadPreview"
            @run-tests="runTests"
          />
        </ResizablePanel>

        <ResizableHandle
          v-if="!isStaticMode"
          class="bg-(--editor-panel-border) data-[resize-handle-state=drag]:outline-3 data-[resize-handle-state=drag]:outline-[color-mix(in_oklch,var(--editor-panel-tab-accent)_40%,transparent)]"
          :with-handle="true"
        />

        <ResizablePanel v-if="!isStaticMode" :default-size="30" :min-size="0" class="min-h-0">
          <ChallengeOutputPanel
            :is-desktop="isDesktop"
            :terminal-output="terminalOutput"
            :test-cases="testCases"
            :test-summary="testSummary"
          />
        </ResizablePanel>
      </ResizablePanelGroup>
      <ChallengeRunnerFooter
        v-model:active-tab="activeEditorTab"
        :is-ready="isReady"
        :is-static-mode="isStaticMode"
        :save-feedback="saveFeedback"
        :setup-label="setupLabel"
      />

      <ChallengeSetupOverlay v-if="showSetupOverlay" :complete="isReady" :stage="setupLabel" />

      <ChallengeCodeViewerDialog
        v-model:active-path="activeSolutionPath"
        v-model:open="showSolutionDialog"
        :description="t('challenge.runner.solution.description')"
        :files="solutionViewerFiles"
        :title="t('challenge.runner.solution.title')"
      >
        <template #footer>
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
        </template>
      </ChallengeCodeViewerDialog>

      <ChallengeCodeViewerDialog
        v-model:active-path="activeTestPath"
        v-model:open="showTestsDialog"
        :description="t('challenge.runner.tests.description')"
        :files="testFiles"
        :title="t('challenge.runner.tests.title')"
      />
    </div>

    <template #fallback>
      <div
        class="h-[430px] rounded-md border border-(--editor-panel-border) bg-(--editor-background)"
      />
    </template>
  </ClientOnly>
</template>
