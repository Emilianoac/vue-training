import type { WebContainerChallenge } from "../../types";
import counterCodeEn from "./Counter.en.vue?raw";
import counterCodeEs from "./Counter.es.vue?raw";
import solutionCodeEn from "./Counter.solution.en.vue?raw";
import solutionCodeEs from "./Counter.solution.es.vue?raw";
import testCodeEn from "./Counter.test.en.ts?raw";
import testCodeEs from "./Counter.test.es.ts?raw";

const localizedFiles = {
  en: {
    counterCode: counterCodeEn,
    solutionCode: solutionCodeEn,
    testCode: testCodeEn,
  },
  es: {
    counterCode: counterCodeEs,
    solutionCode: solutionCodeEs,
    testCode: testCodeEs,
  },
};

export function createRefCounterStateChallenge(locale: string): WebContainerChallenge {
  const files = locale === "en" ? localizedFiles.en : localizedFiles.es;

  return {
    id: "ref-counter-state",
    files: [
      {
        content: files.counterCode,
        editable: true,
        icon: "vue",
        label: "Counter.vue",
        path: "src/Counter.vue",
        solution: files.solutionCode,
      },
      {
        content: files.testCode,
        editable: false,
        icon: "test",
        label: "Counter.test.ts",
        path: "src/Counter.test.ts",
      },
    ],
  };
}
