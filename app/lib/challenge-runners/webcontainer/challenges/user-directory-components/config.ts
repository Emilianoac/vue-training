import type { WebContainerChallenge } from "../../types";
import appEn from "./App.en.vue?raw";
import appEs from "./App.es.vue?raw";
import appSolutionEn from "./App.solution.en.vue?raw";
import appSolutionEs from "./App.solution.es.vue?raw";
import userListEn from "./UserList.en.vue?raw";
import userListEs from "./UserList.es.vue?raw";
import userListSolutionEn from "./UserList.solution.en.vue?raw";
import userListSolutionEs from "./UserList.solution.es.vue?raw";
import testEn from "./UserList.test.en.ts?raw";
import testEs from "./UserList.test.es.ts?raw";

export function createUserDirectoryComponentsChallenge(locale: string): WebContainerChallenge {
  const en = locale === "en";
  return {
    id: "user-directory-components",
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
        content: en ? userListEn : userListEs,
        editable: true,
        icon: "vue",
        label: "UserList.vue",
        path: "src/UserList.vue",
        solution: en ? userListSolutionEn : userListSolutionEs,
      },
      {
        content: en ? testEn : testEs,
        editable: false,
        icon: "test",
        label: "UserList.test.ts",
        path: "src/UserList.test.ts",
      },
    ],
  };
}
