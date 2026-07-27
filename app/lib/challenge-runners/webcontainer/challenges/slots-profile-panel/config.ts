import type { WebContainerChallenge } from "../../types";
import appCodeEn from "./App.en.vue?raw";
import appCodeEs from "./App.es.vue?raw";
import appSolutionCodeEn from "./App.solution.en.vue?raw";
import appSolutionCodeEs from "./App.solution.es.vue?raw";
import basePanelCodeEn from "./BasePanel.en.vue?raw";
import basePanelCodeEs from "./BasePanel.es.vue?raw";
import basePanelSolutionCodeEn from "./BasePanel.solution.en.vue?raw";
import basePanelSolutionCodeEs from "./BasePanel.solution.es.vue?raw";
import testCodeEn from "./BasePanel.test.en.ts?raw";
import testCodeEs from "./BasePanel.test.es.ts?raw";

const localizedFiles = {
  en: {
    appCode: appCodeEn,
    appSolutionCode: appSolutionCodeEn,
    basePanelCode: basePanelCodeEn,
    basePanelSolutionCode: basePanelSolutionCodeEn,
    testCode: testCodeEn,
  },
  es: {
    appCode: appCodeEs,
    appSolutionCode: appSolutionCodeEs,
    basePanelCode: basePanelCodeEs,
    basePanelSolutionCode: basePanelSolutionCodeEs,
    testCode: testCodeEs,
  },
};

export function createSlotsProfilePanelChallenge(locale: string): WebContainerChallenge {
  const files = locale === "en" ? localizedFiles.en : localizedFiles.es;

  return {
    id: "slots-profile-panel",
    files: [
      {
        content: files.basePanelCode,
        editable: true,
        icon: "vue",
        label: "BasePanel.vue",
        path: "src/BasePanel.vue",
        solution: files.basePanelSolutionCode,
      },
      {
        content: files.appCode,
        editable: true,
        icon: "vue",
        label: "App.vue",
        path: "src/App.vue",
        preview: true,
        solution: files.appSolutionCode,
      },
      {
        content: files.testCode,
        editable: false,
        icon: "test",
        label: "BasePanel.test.ts",
        path: "src/BasePanel.test.ts",
      },
    ],
  };
}
