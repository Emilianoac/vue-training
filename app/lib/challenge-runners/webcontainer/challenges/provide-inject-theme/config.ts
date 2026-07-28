import type { WebContainerChallenge } from "../../types";
import appEn from "./App.en.vue?raw";
import appEs from "./App.es.vue?raw";
import appSolutionEn from "./App.solution.en.vue?raw";
import appSolutionEs from "./App.solution.es.vue?raw";
import statusEn from "./ThemeStatus.en.vue?raw";
import statusEs from "./ThemeStatus.es.vue?raw";
import statusSolutionEn from "./ThemeStatus.solution.en.vue?raw";
import statusSolutionEs from "./ThemeStatus.solution.es.vue?raw";
import testEn from "./ThemeStatus.test.en.ts?raw";
import testEs from "./ThemeStatus.test.es.ts?raw";

export function createProvideInjectThemeChallenge(locale: string): WebContainerChallenge {
  const en = locale === "en";
  return {
    id: "provide-inject-theme",
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
        content: en ? statusEn : statusEs,
        editable: true,
        icon: "vue",
        label: "ThemeStatus.vue",
        path: "src/ThemeStatus.vue",
        solution: en ? statusSolutionEn : statusSolutionEs,
      },
      {
        content: en ? testEn : testEs,
        editable: false,
        icon: "test",
        label: "ThemeStatus.test.ts",
        path: "src/ThemeStatus.test.ts",
      },
    ],
  };
}
