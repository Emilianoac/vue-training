import type { WebContainerChallenge } from "../../types";
import appEn from "./App.en.vue?raw";
import appEs from "./App.es.vue?raw";
import sourceEn from "./component-runtime.en.ts?raw";
import sourceEs from "./component-runtime.es.ts?raw";
import solutionEn from "./component-runtime.solution.en.ts?raw";
import solutionEs from "./component-runtime.solution.es.ts?raw";
import testsEn from "./component-runtime.test.en.ts?raw";
import testsEs from "./component-runtime.test.es.ts?raw";

export function createComponentRuntimeChallenge(locale: string): WebContainerChallenge {
  const isEnglish = locale === "en";

  return {
    id: "component-runtime",
    files: [
      {
        content: isEnglish ? sourceEn : sourceEs,
        editable: true,
        icon: "ts",
        label: "component-runtime.ts",
        path: "src/component-runtime.ts",
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
        label: "component-runtime.test.ts",
        path: "src/component-runtime.test.ts",
      },
    ],
  };
}
