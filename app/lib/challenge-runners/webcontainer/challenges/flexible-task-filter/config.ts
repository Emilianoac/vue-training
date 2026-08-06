import type { WebContainerChallenge } from "../../types";
import appEn from "./App.en.vue?raw";
import appEs from "./App.es.vue?raw";
import composableEn from "./useTaskFilter.en.ts?raw";
import composableEs from "./useTaskFilter.es.ts?raw";
import solutionEn from "./useTaskFilter.solution.en.ts?raw";
import solutionEs from "./useTaskFilter.solution.es.ts?raw";
import testEn from "./useTaskFilter.test.en.ts?raw";
import testEs from "./useTaskFilter.test.es.ts?raw";

export function createFlexibleTaskFilterChallenge(locale: string): WebContainerChallenge {
  const en = locale === "en";

  return {
    id: "flexible-task-filter",
    files: [
      {
        content: en ? composableEn : composableEs,
        editable: true,
        icon: "ts",
        label: "useTaskFilter.ts",
        path: "src/useTaskFilter.ts",
        solution: en ? solutionEn : solutionEs,
      },
      {
        content: en ? appEn : appEs,
        editable: false,
        icon: "vue",
        label: "App.vue",
        path: "src/App.vue",
        preview: true,
      },
      {
        content: en ? testEn : testEs,
        editable: false,
        icon: "test",
        label: "useTaskFilter.test.ts",
        path: "src/useTaskFilter.test.ts",
      },
    ],
  };
}
