import type { WebContainerChallenge } from "../../types";
import appEn from "./App.en.vue?raw";
import appEs from "./App.es.vue?raw";
import sourceEn from "./reactivity-primitives.en.ts?raw";
import sourceEs from "./reactivity-primitives.es.ts?raw";
import solutionEn from "./reactivity-primitives.solution.en.ts?raw";
import solutionEs from "./reactivity-primitives.solution.es.ts?raw";
import testsEn from "./reactivity-primitives.test.en.ts?raw";
import testsEs from "./reactivity-primitives.test.es.ts?raw";

export function createReactivePrimitivesChallenge(locale: string): WebContainerChallenge {
  const isEnglish = locale === "en";

  return {
    id: "reactive-primitives",
    files: [
      {
        content: isEnglish ? sourceEn : sourceEs,
        editable: true,
        icon: "ts",
        label: "reactivity-primitives.ts",
        path: "src/reactivity-primitives.ts",
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
        label: "reactivity-primitives.test.ts",
        path: "src/reactivity-primitives.test.ts",
      },
    ],
  };
}
