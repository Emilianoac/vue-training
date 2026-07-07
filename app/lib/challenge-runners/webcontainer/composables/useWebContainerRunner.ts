import type { WebContainer } from "@webcontainer/api";
import { getWebContainerChallenge } from "../registry";
import {
  createChallengeProjectFiles,
  createProjectFiles,
  WEB_CONTAINER_SNAPSHOT_PATH,
  WEB_CONTAINER_TEMPLATE_VERSION,
} from "../template";
import type { RunnerStatus, RunnerTimings, TestCaseResult, TestSummary } from "../types";
import { emptyTestSummary, useVitestReporter } from "./useVitestReporter";
import { prepareSnapshot, removeSnapshot, saveSnapshot } from "../services/snapshotCache";

export function useWebContainerRunner(challengeId = "ref-counter-state") {
  const { locale, t } = useI18n();
  const { parseReport } = useVitestReporter();
  const challenge = getWebContainerChallenge(challengeId, locale.value);
  const editableFile = challenge.files.find((file) => file.editable);

  const code = ref(editableFile?.content ?? "");
  const savedCode = ref(editableFile?.content ?? "");
  const terminalOutput = ref(t("challenge.runner.terminal.initialReady"));
  const status = ref<RunnerStatus>("idle");
  const isColdStart = ref(false);
  const isRunning = ref(false);
  const isPreviewStarting = ref(false);
  const saveFeedback = ref("");
  const previewUrl = ref("");
  const previewFrameKey = ref(0);
  const testSummary = ref<TestSummary>({ ...emptyTestSummary });
  const testCases = ref<TestCaseResult[]>([]);
  const timings = reactive<RunnerTimings>(createEmptyTimings());
  const webcontainer = shallowRef<WebContainer | null>(null);
  let testWatcherProcess: Awaited<ReturnType<WebContainer["spawn"]>> | null = null;
  let previewServerProcess: Awaited<ReturnType<WebContainer["spawn"]>> | null = null;
  let previewServerReadyPromise: Promise<string> | null = null;
  let resolvePreviewServerReady: ((url: string) => void) | null = null;

  const isReady = computed(() => status.value === "ready");
  const isFirstSetupLoading = computed(
    () => isColdStart.value && (status.value === "booting" || status.value === "installing"),
  );
  const hasUnsavedChanges = computed(() => code.value !== savedCode.value);
  const canRunTests = computed(() => isReady.value && !isRunning.value && !isPreviewStarting.value);
  const canLoadPreview = computed(() => isReady.value && !isPreviewStarting.value && !isRunning.value);
  const canSaveCode = computed(
    () => isReady.value && hasUnsavedChanges.value && !isRunning.value && !isPreviewStarting.value,
  );
  const activeFileIcon = computed(() => editableFile?.icon ?? "vue");
  const activeFileLabel = computed(() => editableFile?.label ?? editableFile?.path ?? "Challenge.vue");
  const canLoadSolution = computed(() => Boolean(editableFile?.solution) && !isRunning.value);
  const solutionCode = computed(() => editableFile?.solution ?? "");
  const canResetCode = computed(() => Boolean(editableFile) && !isRunning.value);
  const setupLabel = computed(() => {
    if (status.value === "installing") return t("challenge.runner.status.installing");
    if (status.value === "booting") return t("challenge.runner.status.booting");
    if (status.value === "ready") return t("challenge.runner.status.ready");
    return t("challenge.runner.status.idle");
  });

  onMounted(() => {
    void initializeContainer();
  });

  onBeforeUnmount(() => {
    webcontainer.value?.teardown();
  });

  async function initializeContainer() {
    if (webcontainer.value || status.value === "booting" || status.value === "installing") return;

    Object.assign(timings, createEmptyTimings());
    isColdStart.value = false;
    const totalStartedAt = performance.now();
    terminalOutput.value = "";
    appendLine(t("challenge.runner.terminal.booting"));

    if (!globalThis.crossOriginIsolated) {
      appendLine(t("challenge.runner.terminal.notIsolated"));
      appendLine(t("challenge.runner.terminal.notIsolatedHelp"));
      return;
    }

    status.value = "booting";

    try {
      const cachedSnapshot = await loadCachedSnapshot();
      const { WebContainer } = await import("@webcontainer/api");
      const bootStartedAt = performance.now();
      const container = await WebContainer.boot();
      recordTiming("boot", bootStartedAt);
      webcontainer.value = container;
      container.on("server-ready", (_port, url) => {
        previewUrl.value = url;
        resolvePreviewServerReady?.(url);
        resolvePreviewServerReady = null;
      });
      appendLine(t("challenge.runner.terminal.ready"));

      const mountStartedAt = performance.now();
      const restoredFromCache = await restoreCachedProject(container, cachedSnapshot);

      if (!restoredFromCache) {
        await container.mount(createProjectFiles(challenge.files));
      }

      recordTiming("mount", mountStartedAt);
      appendLine(t("challenge.runner.terminal.mounted"));

      if (!restoredFromCache) {
        const installed = await installDependencies(container);

        if (!installed) {
          recordTiming("total", totalStartedAt);
          container.teardown();
          webcontainer.value = null;
          status.value = "idle";
          return;
        }

        await cacheInstalledProject(container);
      }

      recordTiming("total", totalStartedAt);
      status.value = "ready";
    } catch (error) {
      recordTiming("total", totalStartedAt);
      appendLine(`✗ ${getErrorMessage(error, t("challenge.runner.terminal.unknownError"))}`);
      webcontainer.value?.teardown();
      webcontainer.value = null;
      status.value = "idle";
    }
  }

  async function runTests() {
    const container = webcontainer.value;
    if (!container || !canRunTests.value) return;

    isRunning.value = true;
    testSummary.value = { ...emptyTestSummary };
    testCases.value = [];
    appendLine("");
    appendLine(t("challenge.runner.terminal.runTests"));

    try {
      await container.fs.rm("/vitest-results.json", { force: true });

      if (editableFile) {
        await writeEditableFile(container);
      }

      if (!testWatcherProcess) {
        testWatcherProcess = await startTestWatcher(container);
      }

      const hasTestReport = await waitForTestReport(container);

      if (!hasTestReport) {
        appendLine(t("challenge.runner.terminal.testReportMissing"));
      } else {
        appendLine(
          testSummary.value.total > 0 && testSummary.value.failed === 0
            ? t("challenge.runner.terminal.testsPassed")
            : t("challenge.runner.terminal.testsFailed", { code: 1 }),
        );
      }
    } catch (error) {
      appendLine(`✗ ${getErrorMessage(error, t("challenge.runner.terminal.unknownError"))}`);
    } finally {
      isRunning.value = false;
    }
  }

  async function loadPreview() {
    const container = webcontainer.value;
    if (!container || !canLoadPreview.value) return;

    isPreviewStarting.value = true;

    try {
      await writeEditableFile(container);
      await ensurePreviewServer(container);
      previewFrameKey.value++;
    } catch (error) {
      appendLine(`✗ ${getErrorMessage(error, t("challenge.runner.terminal.unknownError"))}`);
    } finally {
      isPreviewStarting.value = false;
    }
  }

  async function saveCode() {
    const container = webcontainer.value;
    if (!container || !canSaveCode.value) return;

    try {
      await writeEditableFile(container);
      saveFeedback.value = t("challenge.runner.status.saved");
      window.setTimeout(() => {
        saveFeedback.value = "";
      }, 2500);
    } catch (error) {
      appendLine(`✗ ${getErrorMessage(error, t("challenge.runner.terminal.unknownError"))}`);
    }
  }

  function resetCode() {
    if (!editableFile || isRunning.value) return;

    code.value = editableFile.content;
    savedCode.value = editableFile.content;
    resetTestState();
  }

  function loadSolution() {
    if (!editableFile?.solution || isRunning.value) return;

    code.value = editableFile.solution;
    savedCode.value = editableFile.solution;
    resetTestState();
  }

  async function writeEditableFile(container: WebContainer) {
    if (!editableFile) return;
    await container.fs.writeFile(`/${editableFile.path}`, code.value);
    savedCode.value = code.value;
  }

  async function ensurePreviewServer(container: WebContainer) {
    if (previewUrl.value) return previewUrl.value;

    const previewStartedAt = performance.now();

    if (!previewServerReadyPromise) {
      previewServerReadyPromise = new Promise<string>((resolve) => {
        resolvePreviewServerReady = resolve;
      });
    }

    if (!previewServerProcess) {
      appendLine("");
      appendLine(t("challenge.runner.terminal.startPreview"));
      previewServerProcess = await container.spawn("npm", ["run", "dev"], {
        env: {
          CI: "true",
        },
      });
      pipeProcessOutput(previewServerProcess);
      void previewServerProcess.exit.then(() => {
        previewServerProcess = null;
        previewServerReadyPromise = null;
        resolvePreviewServerReady = null;
        previewUrl.value = "";
      });
    }

    const url = await previewServerReadyPromise;
    recordTiming("preview", previewStartedAt);
    return url;
  }

  async function startTestWatcher(container: WebContainer) {
    const process = await container.spawn(
      "node",
      [
        "./node_modules/vitest/vitest.mjs",
        "--watch",
        "--pool=threads",
        "--maxWorkers=1",
        "--no-isolate",
        "--reporter=verbose",
        "--reporter=json",
        "--outputFile=vitest-results.json",
      ],
      {
        env: {
          NO_COLOR: "1",
        },
      },
    );

    pipeProcessOutput(process);
    void process.exit.then(() => {
      if (testWatcherProcess === process) testWatcherProcess = null;
    });
    return process;
  }

  async function loadCachedSnapshot() {
    const cacheStartedAt = performance.now();
    isColdStart.value = true;

    try {
      const preparedSnapshot = await prepareSnapshot(
        WEB_CONTAINER_TEMPLATE_VERSION,
        WEB_CONTAINER_SNAPSHOT_PATH,
      );
      isColdStart.value = preparedSnapshot?.source !== "indexeddb";
      recordTiming("cacheRead", cacheStartedAt);

      if (preparedSnapshot?.source === "static") {
        appendLine(t("challenge.runner.terminal.staticSnapshot"));
      }

      return preparedSnapshot?.snapshot ?? null;
    } catch {
      isColdStart.value = true;
      recordTiming("cacheRead", cacheStartedAt);
      appendLine(t("challenge.runner.terminal.cacheUnavailable"));
      return null;
    }
  }

  async function restoreCachedProject(container: WebContainer, snapshot: ArrayBuffer | null) {
    if (!snapshot) {
      appendLine(t("challenge.runner.terminal.cacheMiss"));
      return false;
    }

    try {
      await container.mount(snapshot);
    } catch {
      await removeSnapshot(WEB_CONTAINER_TEMPLATE_VERSION);
      isColdStart.value = true;
      appendLine(t("challenge.runner.terminal.cacheInvalid"));
      return false;
    }

    await container.mount(createChallengeProjectFiles(challenge.files));
    appendLine(t("challenge.runner.terminal.cacheHit"));
    return true;
  }

  async function installDependencies(container: WebContainer) {
    status.value = "installing";
    appendLine(t("challenge.runner.terminal.install"));
    const installStartedAt = performance.now();
    const install = await container.spawn(
      "npm",
      ["install", "--no-progress", "--no-audit", "--no-fund"],
      {
        env: {
          CI: "true",
          NO_COLOR: "1",
        },
      },
    );

    pipeProcessOutput(install);
    const installExitCode = await install.exit;
    recordTiming("install", installStartedAt);

    if (installExitCode !== 0) {
      appendLine(t("challenge.runner.terminal.installFailed", { code: installExitCode }));
      return false;
    }

    appendLine(t("challenge.runner.terminal.installed"));
    return true;
  }

  async function cacheInstalledProject(container: WebContainer) {
    const cacheStartedAt = performance.now();

    try {
      const exported = await container.export(".", {
        format: "binary",
        excludes: ["src/**", "vitest-results.json"],
      });

      if (!(exported instanceof Uint8Array)) return;

      const snapshot = new Uint8Array(exported).slice().buffer;
      await saveSnapshot(WEB_CONTAINER_TEMPLATE_VERSION, snapshot);
      appendLine(t("challenge.runner.terminal.cacheSaved"));
    } catch {
      appendLine(t("challenge.runner.terminal.cacheSaveFailed"));
    } finally {
      recordTiming("cacheWrite", cacheStartedAt);
    }
  }

  function pipeProcessOutput(process: Awaited<ReturnType<WebContainer["spawn"]>>) {
    process.output.pipeTo(
      new WritableStream({
        write(data) {
          appendOutput(data);
        },
      }),
    );
  }

  function appendLine(line: string) {
    appendOutput(`${line}\r\n`);
  }

  function appendOutput(output: string) {
    terminalOutput.value = `${terminalOutput.value}${output}`;
  }

  async function updateTestReport(container: WebContainer) {
    try {
      const report = await container.fs.readFile("/vitest-results.json", "utf-8");
      const parsedReport = parseReport(JSON.parse(report));
      testSummary.value = parsedReport.summary;
      testCases.value = parsedReport.testCases;
      return true;
    } catch {
      testSummary.value = { ...emptyTestSummary };
      testCases.value = [];
      return false;
    }
  }

  async function waitForTestReport(container: WebContainer) {
    const timeoutAt = performance.now() + 30_000;

    while (performance.now() < timeoutAt) {
      if (await updateTestReport(container)) return true;
      await new Promise((resolve) => window.setTimeout(resolve, 50));
    }

    return false;
  }

  function resetTestState() {
    testSummary.value = { ...emptyTestSummary };
    testCases.value = [];
  }

  function recordTiming(stage: keyof RunnerTimings, startedAt: number) {
    const duration = Math.round((performance.now() - startedAt) * 100) / 100;
    timings[stage] = duration;
    appendLine(
      t("challenge.runner.terminal.timing", {
        duration,
        stage: t(`challenge.runner.terminal.timings.${stage}`),
      }),
    );
  }

  return {
    activeFileIcon,
    activeFileLabel,
    hasUnsavedChanges,
    canSaveCode,
    canLoadSolution,
    canLoadPreview,
    canResetCode,
    canRunTests,
    code,
    solutionCode,
    isColdStart,
    isReady,
    isRunning,
    isPreviewStarting,
    isFirstSetupLoading,
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
    timings,
  };
}

function createEmptyTimings(): RunnerTimings {
  return {
    boot: null,
    cacheRead: null,
    cacheWrite: null,
    install: null,
    mount: null,
    preview: null,
    total: null,
  };
}

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error) return error.message;
  return fallback;
}
