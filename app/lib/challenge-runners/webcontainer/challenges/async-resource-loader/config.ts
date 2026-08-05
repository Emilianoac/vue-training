import type { WebContainerChallenge } from "../../types";
import appEn from "./App.en.vue?raw";
import appEs from "./App.es.vue?raw";
import composableEn from "./useProductLoader.en.ts?raw";
import composableEs from "./useProductLoader.es.ts?raw";
import solutionEn from "./useProductLoader.solution.en.ts?raw";
import solutionEs from "./useProductLoader.solution.es.ts?raw";
import testEn from "./useProductLoader.test.en.ts?raw";
import testEs from "./useProductLoader.test.es.ts?raw";

export function createAsyncResourceLoaderChallenge(locale: string): WebContainerChallenge {
  const en = locale === "en";

  return {
    id: "async-resource-loader",
    files: [
      {
        content: en ? composableEn : composableEs,
        editable: true,
        icon: "ts",
        label: "useProductLoader.ts",
        path: "src/useProductLoader.ts",
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
        label: "useProductLoader.test.ts",
        path: "src/useProductLoader.test.ts",
      },
    ],
  };
}
