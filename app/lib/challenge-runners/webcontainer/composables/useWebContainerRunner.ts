import type { WebContainer } from "@webcontainer/api";
import { getWebContainerChallenge } from "../registry";
import { createProjectFiles } from "../template";
import type { RunnerStatus, TestCaseResult, TestSummary } from "../types";
import { emptyTestSummary, useVitestReporter } from "./useVitestReporter";

export function useWebContainerRunner(challengeId = "ref-counter-state") {
  const { locale, t } = useI18n();
  const { parseReport } = useVitestReporter();
  const challenge = getWebContainerChallenge(challengeId, locale.value);
  const editableFile = challenge.files.find((file) => file.editable);

  const code = ref(editableFile?.content ?? "");
  const savedCode = ref(editableFile?.content ?? "");
  const terminalOutput = ref(t("challenge.runner.terminal.initialReady"));
  const status = ref<RunnerStatus>("idle");
  const isRunning = ref(false);
  const isPreviewStarting = ref(false);
  const saveFeedback = ref("");
  const previewUrl = ref("");
  const previewFrameKey = ref(0);
  const testSummary = ref<TestSummary>({ ...emptyTestSummary });
  const testCases = ref<TestCaseResult[]>([]);
  const webcontainer = shallowRef<WebContainer | null>(null);
  let previewServerProcess: Awaited<ReturnType<WebContainer["spawn"]>> | null = null;
  let previewServerReadyPromise: Promise<string> | null = null;
  let resolvePreviewServerReady: ((url: string) => void) | null = null;

  const isReady = computed(() => status.value === "ready");
  const hasUnsavedChanges = computed(() => code.value !== savedCode.value);
  const canRunTests = computed(() => isReady.value && !isRunning.value && !isPreviewStarting.value);
  const canLoadPreview = computed(() => isReady.value && !isPreviewStarting.value && !isRunning.value);
  const canSaveCode = computed(
    () => isReady.value && hasUnsavedChanges.value && !isRunning.value && !isPreviewStarting.value,
  );
  const activeFileIcon = computed(() => editableFile?.icon ?? "vue");
  const activeFileLabel = computed(() => editableFile?.label ?? editableFile?.path ?? "Challenge.vue");
  const canLoadSolution = computed(() => Boolean(editableFile?.solution) && !isRunning.value);
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

    terminalOutput.value = "";
    appendLine(t("challenge.runner.terminal.booting"));

    if (!globalThis.crossOriginIsolated) {
      appendLine(t("challenge.runner.terminal.notIsolated"));
      appendLine(t("challenge.runner.terminal.notIsolatedHelp"));
      return;
    }

    status.value = "booting";

    try {
      const { WebContainer } = await import("@webcontainer/api");
      const container = await WebContainer.boot();
      webcontainer.value = container;
      container.on("server-ready", (_port, url) => {
        previewUrl.value = url;
        resolvePreviewServerReady?.(url);
        resolvePreviewServerReady = null;
      });
      appendLine(t("challenge.runner.terminal.ready"));

      await container.mount(createProjectFiles(challenge.files));
      appendLine(t("challenge.runner.terminal.mounted"));

      status.value = "installing";
      appendLine(t("challenge.runner.terminal.install"));
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

      if (installExitCode !== 0) {
        appendLine(t("challenge.runner.terminal.installFailed", { code: installExitCode }));
        container.teardown();
        webcontainer.value = null;
        status.value = "idle";
        return;
      }

      appendLine(t("challenge.runner.terminal.installed"));
      status.value = "ready";
    } catch (error) {
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
      if (editableFile) {
        await writeEditableFile(container);
      }
      const test = await container.spawn("npm", ["run", "test"], {
        env: {
          CI: "true",
        },
      });
      pipeProcessOutput(test);
      const testExitCode = await test.exit;
      await updateTestReport(container);

      appendLine(
        testExitCode === 0
          ? t("challenge.runner.terminal.testsPassed")
          : t("challenge.runner.terminal.testsFailed", { code: testExitCode }),
      );
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

    return previewServerReadyPromise;
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
    } catch {
      testSummary.value = { ...emptyTestSummary };
      testCases.value = [];
    }
  }

  function resetTestState() {
    testSummary.value = { ...emptyTestSummary };
    testCases.value = [];
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
    isReady,
    isRunning,
    isPreviewStarting,
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
  };
}

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error) return error.message;
  return fallback;
}
