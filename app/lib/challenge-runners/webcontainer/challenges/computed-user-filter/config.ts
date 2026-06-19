import type { WebContainerChallenge } from "../../types";
import userFilterCodeEn from "./UserFilter.en.vue?raw";
import userFilterCodeEs from "./UserFilter.es.vue?raw";
import solutionCodeEn from "./UserFilter.solution.en.vue?raw";
import solutionCodeEs from "./UserFilter.solution.es.vue?raw";
import testCodeEn from "./UserFilter.test.en.ts?raw";
import testCodeEs from "./UserFilter.test.es.ts?raw";

const localizedFiles = {
  en: {
    solutionCode: solutionCodeEn,
    testCode: testCodeEn,
    userFilterCode: userFilterCodeEn,
  },
  es: {
    solutionCode: solutionCodeEs,
    testCode: testCodeEs,
    userFilterCode: userFilterCodeEs,
  },
};

export function createComputedUserFilterChallenge(locale: string): WebContainerChallenge {
  const files = locale === "en" ? localizedFiles.en : localizedFiles.es;

  return {
    id: "computed-user-filter",
    files: [
      {
        content: files.userFilterCode,
        editable: true,
        icon: "vue",
        label: "UserFilter.vue",
        path: "src/UserFilter.vue",
        solution: files.solutionCode,
      },
      {
        content: files.testCode,
        editable: false,
        icon: "test",
        label: "UserFilter.test.ts",
        path: "src/UserFilter.test.ts",
      },
    ],
  };
}
