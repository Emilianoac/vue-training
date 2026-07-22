import type { WebContainerChallenge } from "../../types";
import sessionMonitorCodeEn from "./SessionMonitor.en.vue?raw";
import sessionMonitorCodeEs from "./SessionMonitor.es.vue?raw";
import solutionCodeEn from "./SessionMonitor.solution.en.vue?raw";
import solutionCodeEs from "./SessionMonitor.solution.es.vue?raw";
import testCodeEn from "./SessionMonitor.test.en.ts?raw";
import testCodeEs from "./SessionMonitor.test.es.ts?raw";

const localizedFiles = {
  en: {
    sessionMonitorCode: sessionMonitorCodeEn,
    solutionCode: solutionCodeEn,
    testCode: testCodeEn,
  },
  es: {
    sessionMonitorCode: sessionMonitorCodeEs,
    solutionCode: solutionCodeEs,
    testCode: testCodeEs,
  },
};

export function createLifecycleSessionMonitorChallenge(locale: string): WebContainerChallenge {
  const files = locale === "en" ? localizedFiles.en : localizedFiles.es;

  return {
    id: "lifecycle-session-monitor",
    files: [
      {
        content: files.sessionMonitorCode,
        editable: true,
        icon: "vue",
        label: "SessionMonitor.vue",
        path: "src/SessionMonitor.vue",
        solution: files.solutionCode,
      },
      {
        content: files.testCode,
        editable: false,
        icon: "test",
        label: "SessionMonitor.test.ts",
        path: "src/SessionMonitor.test.ts",
      },
    ],
  };
}
