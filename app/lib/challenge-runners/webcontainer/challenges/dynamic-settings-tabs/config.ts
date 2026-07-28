import type { WebContainerChallenge } from "../../types";
import appEn from "./App.en.vue?raw";
import appEs from "./App.es.vue?raw";
import solutionEn from "./App.solution.en.vue?raw";
import solutionEs from "./App.solution.es.vue?raw";
import profileEn from "./ProfileTab.en.vue?raw";
import profileEs from "./ProfileTab.es.vue?raw";
import securityEn from "./SecurityTab.en.vue?raw";
import securityEs from "./SecurityTab.es.vue?raw";
import securitySolutionEn from "./SecurityTab.solution.en.vue?raw";
import securitySolutionEs from "./SecurityTab.solution.es.vue?raw";
import testEn from "./App.test.en.ts?raw";
import testEs from "./App.test.es.ts?raw";

export function createDynamicSettingsTabsChallenge(locale: string): WebContainerChallenge {
  const en = locale === "en";
  return {
    id: "dynamic-settings-tabs",
    files: [
      {
        content: en ? appEn : appEs,
        editable: true,
        icon: "vue",
        label: "App.vue",
        path: "src/App.vue",
        preview: true,
        solution: en ? solutionEn : solutionEs,
      },
      {
        content: en ? profileEn : profileEs,
        editable: true,
        icon: "vue",
        label: "ProfileTab.vue",
        path: "src/ProfileTab.vue",
      },
      {
        content: en ? securityEn : securityEs,
        editable: true,
        icon: "vue",
        label: "SecurityTab.vue",
        path: "src/SecurityTab.vue",
        solution: en ? securitySolutionEn : securitySolutionEs,
      },
      {
        content: en ? testEn : testEs,
        editable: false,
        icon: "test",
        label: "App.test.ts",
        path: "src/App.test.ts",
      },
    ],
  };
}
