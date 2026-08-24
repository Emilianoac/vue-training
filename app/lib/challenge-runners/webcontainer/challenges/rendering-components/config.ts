import type { WebContainerChallenge } from "../../types";
import appEn from "./App.en.vue?raw";
import appEs from "./App.es.vue?raw";
import host from "./host.ts?raw";
import sourceEn from "./renderer.en.ts?raw";
import sourceEs from "./renderer.es.ts?raw";
import solution from "./renderer.solution.en.ts?raw";
import testsEn from "./renderer.test.en.ts?raw";
import testsEs from "./renderer.test.es.ts?raw";

export function createRenderingComponentsChallenge(locale: string): WebContainerChallenge {
  const isEnglish = locale === "en";

  return {
    id: "rendering-components",
    files: [
      {
        content: isEnglish ? sourceEn : sourceEs,
        editable: true,
        icon: "ts",
        label: "renderer.ts",
        path: "src/renderer.ts",
        solution,
      },
      {
        content: host,
        editable: false,
        icon: "ts",
        label: "host.ts",
        path: "src/host.ts",
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
        label: "renderer.test.ts",
        path: "src/renderer.test.ts",
      },
    ],
  };
}
