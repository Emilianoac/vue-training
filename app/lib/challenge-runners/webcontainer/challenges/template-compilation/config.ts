import type { WebContainerChallenge } from "../../types";
import appEn from "./App.en.vue?raw";
import appEs from "./App.es.vue?raw";
import sourceEn from "./compiler.en.ts?raw";
import sourceEs from "./compiler.es.ts?raw";
import solution from "./compiler.solution.en.ts?raw";
import testsEn from "./compiler.test.en.ts?raw";
import testsEs from "./compiler.test.es.ts?raw";

export function createTemplateCompilationChallenge(locale: string): WebContainerChallenge {
  const isEnglish = locale === "en";

  return {
    id: "template-compilation",
    files: [
      { content: isEnglish ? sourceEn : sourceEs, editable: true, icon: "ts", label: "compiler.ts", path: "src/compiler.ts", solution },
      { content: isEnglish ? appEn : appEs, editable: false, icon: "vue", label: "App.vue", path: "src/App.vue", preview: true },
      { content: isEnglish ? testsEn : testsEs, editable: false, icon: "test", label: "compiler.test.ts", path: "src/compiler.test.ts" },
    ],
  };
}
