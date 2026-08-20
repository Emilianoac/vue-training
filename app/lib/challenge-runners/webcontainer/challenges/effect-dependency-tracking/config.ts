import type { WebContainerChallenge } from "../../types";
import appEn from "./App.en.vue?raw";
import appEs from "./App.es.vue?raw";
import sourceEn from "./reactivity.en.ts?raw";
import sourceEs from "./reactivity.es.ts?raw";
import solutionEn from "./reactivity.solution.en.ts?raw";
import solutionEs from "./reactivity.solution.es.ts?raw";
import testsEn from "./reactivity.test.en.ts?raw";
import testsEs from "./reactivity.test.es.ts?raw";

export function createEffectDependencyTrackingChallenge(locale: string): WebContainerChallenge {
  const isEnglish = locale === "en";

  return {
    id: "effect-dependency-tracking",
    files: [
      {
        content: isEnglish ? sourceEn : sourceEs,
        editable: true,
        icon: "ts",
        label: "reactivity.ts",
        path: "src/reactivity.ts",
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
        label: "reactivity.test.ts",
        path: "src/reactivity.test.ts",
      },
    ],
  };
}
