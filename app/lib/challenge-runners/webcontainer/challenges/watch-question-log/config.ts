import type { WebContainerChallenge } from "../../types";
import questionWatcherCodeEn from "./QuestionWatcher.en.vue?raw";
import questionWatcherCodeEs from "./QuestionWatcher.es.vue?raw";
import solutionCodeEn from "./QuestionWatcher.solution.en.vue?raw";
import solutionCodeEs from "./QuestionWatcher.solution.es.vue?raw";
import testCodeEn from "./QuestionWatcher.test.en.ts?raw";
import testCodeEs from "./QuestionWatcher.test.es.ts?raw";

const localizedFiles = {
  en: {
    questionWatcherCode: questionWatcherCodeEn,
    solutionCode: solutionCodeEn,
    testCode: testCodeEn,
  },
  es: {
    questionWatcherCode: questionWatcherCodeEs,
    solutionCode: solutionCodeEs,
    testCode: testCodeEs,
  },
};

export function createWatchQuestionLogChallenge(locale: string): WebContainerChallenge {
  const files = locale === "en" ? localizedFiles.en : localizedFiles.es;

  return {
    id: "watch-question-log",
    files: [
      {
        content: files.questionWatcherCode,
        editable: true,
        icon: "vue",
        label: "QuestionWatcher.vue",
        path: "src/QuestionWatcher.vue",
        solution: files.solutionCode,
      },
      {
        content: files.testCode,
        editable: false,
        icon: "test",
        label: "QuestionWatcher.test.ts",
        path: "src/QuestionWatcher.test.ts",
      },
    ],
  };
}
