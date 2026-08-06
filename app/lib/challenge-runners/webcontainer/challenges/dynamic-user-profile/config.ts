import type { WebContainerChallenge } from "../../types";
import appEn from "./App.en.vue?raw";
import appEs from "./App.es.vue?raw";
import entry from "./main.ts?raw";
import profileEn from "./UserProfile.en.vue?raw";
import profileEs from "./UserProfile.es.vue?raw";
import solutionEn from "./UserProfile.solution.en.vue?raw";
import solutionEs from "./UserProfile.solution.es.vue?raw";
import testEn from "./UserProfile.test.en.ts?raw";
import testEs from "./UserProfile.test.es.ts?raw";

export function createDynamicUserProfileChallenge(locale: string): WebContainerChallenge {
  const en = locale === "en";

  return {
    id: "dynamic-user-profile",
    addons: ["vue-router"],
    entry,
    files: [
      {
        content: en ? profileEn : profileEs,
        editable: true,
        icon: "vue",
        label: "UserProfile.vue",
        path: "src/UserProfile.vue",
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
        label: "UserProfile.test.ts",
        path: "src/UserProfile.test.ts",
      },
    ],
  };
}
