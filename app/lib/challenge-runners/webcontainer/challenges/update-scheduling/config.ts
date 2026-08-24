import type { WebContainerChallenge } from "../../types";
import appEn from "./App.en.vue?raw";
import appEs from "./App.es.vue?raw";
import sourceEn from "./scheduler.en.ts?raw";
import sourceEs from "./scheduler.es.ts?raw";
import solutionEn from "./scheduler.solution.en.ts?raw";
import solutionEs from "./scheduler.solution.es.ts?raw";
import testsEn from "./scheduler.test.en.ts?raw";
import testsEs from "./scheduler.test.es.ts?raw";

export function createUpdateSchedulingChallenge(locale: string): WebContainerChallenge {
  const isEnglish = locale === "en";

  return {
    id: "update-scheduling",
    files: [
      {
        content: isEnglish ? sourceEn : sourceEs,
        editable: true,
        icon: "ts",
        label: "scheduler.ts",
        path: "src/scheduler.ts",
        solution: isEnglish ? solutionEn : solutionEs,
      },
      {
        content: isEnglish ? appEn : appEs,
        editable: false,
        icon: "vue",
        label: "App.vue",
        path: "src/App.vue",
        preview: true,
      },
      {
        content: isEnglish ? testsEn : testsEs,
        editable: false,
        icon: "test",
        label: "scheduler.test.ts",
        path: "src/scheduler.test.ts",
      },
    ],
  };
}
