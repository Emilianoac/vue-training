import type { WebContainer } from "@webcontainer/api";
import { getWebContainerChallenge } from "../registry";
import {
  createChallengeProjectFiles,
  createProjectFiles,
  WEB_CONTAINER_SNAPSHOT_PATH,
  WEB_CONTAINER_TEMPLATE_VERSION,
} from "../template";
import type {
  EditorFileTab,
  EditorSolutionFile,
  RunnerStatus,
  RunnerTimings,
  TestCaseResult,
  TestSummary,
} from "../types";
import { emptyTestSummary, useVitestReporter } from "./useVitestReporter";
import { prepareSnapshot, removeSnapshot, saveSnapshot } from "../services/snapshotCache";

export function useWebContainerRunner(challengeId = "ref-counter-state") {
  const { locale, t } = useI18n();
  const { parseReport } = useVitestReporter();
  const challenge = getWebContainerChallenge(challengeId, locale.value);
  const editableChallengeFiles = challenge.files.filter((file) => file.editable);
  const editableFiles: EditorFileTab[] = editableChallengeFiles.map(({ icon, label, path }) => ({
    icon,
    label,
    path,
  }));
  const solutionFiles: EditorSolutionFile[] = editableChallengeFiles.flatMap((file) =>
    file.solution
      ? [
          {
            icon: file.icon,
            label: file.label,
            path: file.path,
            solution: file.solution,
          },
        ]
      : [],
  );
  const activeFilePath = ref(editableChallengeFiles[0]?.path ?? "");
  const fileContents = reactive<Record<string, string>>(
    Object.fromEntries(editableChallengeFiles.map((file) => [file.path, file.content])),
  );
  const savedFileContents = reactive<Record<string, string>>(
    Object.fromEntries(editableChallengeFiles.map((file) => [file.path, file.content])),
  );

  const activeFile = computed(() =>
    editableChallengeFiles.find((file) => file.path === activeFilePath.value),
  );
  const code = computed({
    get: () => fileContents[activeFilePath.value] ?? "",
    set: (value: string) => {
      if (!activeFilePath.value) return;
      fileContents[activeFilePath.value] = value;
    },
  });
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
  const dirtyFilePaths = computed(() =>
    editableChallengeFiles
      .filter((file) => fileContents[file.path] !== savedFileContents[file.path])
      .map((file) => file.path),
  );
  const hasUnsavedChanges = computed(() => dirtyFilePaths.value.length > 0);
  const canRunTests = computed(() => isReady.value && !isRunning.value && !isPreviewStarting.value);
  const canLoadPreview = computed(
    () => isReady.value && !isPreviewStarting.value && !isRunning.value,
  );
  const canSaveCode = computed(
    () => isReady.value && hasUnsavedChanges.value && !isRunning.value && !isPreviewStarting.value,
  );
  const canLoadSolution = computed(() => Boolean(activeFile.value?.solution) && !isRunning.value);
  const canLoadCompleteSolution = computed(() => solutionFiles.length > 1 && !isRunning.value);
  const canResetCode = computed(() => Boolean(activeFile.value) && !isRunning.value);
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

      await writeEditableFiles(container);

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
      await writeEditableFiles(container);
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

    const shouldRefreshTestReport = Boolean(testWatcherProcess);

    try {
      if (shouldRefreshTestReport) {
        isRunning.value = true;
        await container.fs.rm("/vitest-results.json", { force: true });
      }

      await writeEditableFiles(container);
      saveFeedback.value = t("challenge.runner.status.saved");
      window.setTimeout(() => {
        saveFeedback.value = "";
      }, 2500);

      if (shouldRefreshTestReport) {
        const hasTestReport = await waitForTestReport(container);

        if (!hasTestReport) {
          appendLine(t("challenge.runner.terminal.testReportMissing"));
        }
      }
    } catch (error) {
      appendLine(`✗ ${getErrorMessage(error, t("challenge.runner.terminal.unknownError"))}`);
    } finally {
      if (shouldRefreshTestReport) isRunning.value = false;
    }
  }

  function resetCode() {
    const file = activeFile.value;
    if (!file || isRunning.value) return;

    fileContents[file.path] = file.content;
    resetTestState();
  }

  function loadSolution(path = activeFilePath.value) {
    const file = editableChallengeFiles.find((candidate) => candidate.path === path);
    if (!file?.solution || isRunning.value) return;

    fileContents[file.path] = file.solution;
    resetTestState();
  }

  function loadCompleteSolution() {
    if (!canLoadCompleteSolution.value) return;

    for (const file of solutionFiles) {
      fileContents[file.path] = file.solution;
    }

    resetTestState();
  }

  function selectFile(path: string) {
    if (!editableChallengeFiles.some((file) => file.path === path)) return;
    activeFilePath.value = path;
  }

  async function writeEditableFiles(container: WebContainer) {
    await Promise.all(
      editableChallengeFiles.map(async (file) => {
        const content = fileContents[file.path] ?? file.content;
        await container.fs.writeFile(`/${file.path}`, content);
        savedFileContents[file.path] = content;
      }),
    );
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
    activeFilePath,
    hasUnsavedChanges,
    canSaveCode,
    canLoadSolution,
    canLoadCompleteSolution,
    canLoadPreview,
    canResetCode,
    canRunTests,
    code,
    dirtyFilePaths,
    editableFiles,
    isColdStart,
    isReady,
    isRunning,
    isPreviewStarting,
    isFirstSetupLoading,
    loadPreview,
    loadSolution,
    loadCompleteSolution,
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
