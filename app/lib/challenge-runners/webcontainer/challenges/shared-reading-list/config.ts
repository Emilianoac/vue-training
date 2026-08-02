import type { WebContainerChallenge } from "../../types";
import appEn from "./App.en.vue?raw";
import appEs from "./App.es.vue?raw";
import catalogEn from "./LessonCatalog.en.vue?raw";
import catalogEs from "./LessonCatalog.es.vue?raw";
import readingListEn from "./ReadingList.en.vue?raw";
import readingListEs from "./ReadingList.es.vue?raw";
import composableEn from "./useReadingList.en.ts?raw";
import composableEs from "./useReadingList.es.ts?raw";
import composableSolutionEn from "./useReadingList.solution.en.ts?raw";
import composableSolutionEs from "./useReadingList.solution.es.ts?raw";
import testEn from "./useReadingList.test.en.ts?raw";
import testEs from "./useReadingList.test.es.ts?raw";

export function createSharedReadingListChallenge(locale: string): WebContainerChallenge {
  const en = locale === "en";
  return {
    id: "shared-reading-list",
    files: [
      {
        content: en ? composableEn : composableEs,
        editable: true,
        icon: "ts",
        label: "useReadingList.ts",
        path: "src/useReadingList.ts",
        solution: en ? composableSolutionEn : composableSolutionEs,
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
        content: en ? catalogEn : catalogEs,
        editable: false,
        icon: "vue",
        label: "LessonCatalog.vue",
        path: "src/LessonCatalog.vue",
      },
      {
        content: en ? readingListEn : readingListEs,
        editable: false,
        icon: "vue",
        label: "ReadingList.vue",
        path: "src/ReadingList.vue",
      },
      {
        content: en ? testEn : testEs,
        editable: false,
        icon: "test",
        label: "useReadingList.test.ts",
        path: "src/useReadingList.test.ts",
      },
    ],
  };
}
