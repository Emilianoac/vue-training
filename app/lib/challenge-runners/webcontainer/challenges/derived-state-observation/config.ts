import type { WebContainerChallenge } from "../../types";
import appEn from "./App.en.vue?raw";
import appEs from "./App.es.vue?raw";
import core from "./reactivity-core.ts?raw";
import sourceEn from "./observation.en.ts?raw";
import sourceEs from "./observation.es.ts?raw";
import solutionEn from "./observation.solution.en.ts?raw";
import solutionEs from "./observation.solution.es.ts?raw";
import testsEn from "./observation.test.en.ts?raw";
import testsEs from "./observation.test.es.ts?raw";

export function createDerivedStateObservationChallenge(locale: string): WebContainerChallenge {
  const isEnglish = locale === "en";

  return {
    id: "derived-state-observation",
    files: [
      {
        content: isEnglish ? sourceEn : sourceEs,
        editable: true,
        icon: "ts",
        label: "observation.ts",
        path: "src/observation.ts",
        solution: isEnglish ? solutionEn : solutionEs,
      },
      {
        content: core,
        editable: false,
        icon: "ts",
        label: "reactivity-core.ts",
        path: "src/reactivity-core.ts",
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
        label: "observation.test.ts",
        path: "src/observation.test.ts",
      },
    ],
  };
}
