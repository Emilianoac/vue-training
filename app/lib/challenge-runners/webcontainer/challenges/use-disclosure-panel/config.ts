import type { WebContainerChallenge } from "../../types";
import appEn from "./App.en.vue?raw";
import appEs from "./App.es.vue?raw";
import appSolutionEn from "./App.solution.en.vue?raw";
import appSolutionEs from "./App.solution.es.vue?raw";
import composableEn from "./useDisclosure.en.ts?raw";
import composableEs from "./useDisclosure.es.ts?raw";
import composableSolutionEn from "./useDisclosure.solution.en.ts?raw";
import composableSolutionEs from "./useDisclosure.solution.es.ts?raw";
import testEn from "./useDisclosure.test.en.ts?raw";
import testEs from "./useDisclosure.test.es.ts?raw";

export function createUseDisclosurePanelChallenge(locale: string): WebContainerChallenge {
  const en = locale === "en";
  return {
    id: "use-disclosure-panel",
    files: [
      {
        content: en ? appEn : appEs,
        editable: true,
        icon: "vue",
        label: "App.vue",
        path: "src/App.vue",
        preview: true,
        solution: en ? appSolutionEn : appSolutionEs,
      },
      {
        content: en ? composableEn : composableEs,
        editable: true,
        icon: "ts",
        label: "useDisclosure.ts",
        path: "src/useDisclosure.ts",
        solution: en ? composableSolutionEn : composableSolutionEs,
      },
      {
        content: en ? testEn : testEs,
        editable: false,
        icon: "test",
        label: "useDisclosure.test.ts",
        path: "src/useDisclosure.test.ts",
      },
    ],
  };
}
