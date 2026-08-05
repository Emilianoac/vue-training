import type { WebContainerChallenge } from "../../types";
import appEn from "./App.en.vue?raw";
import appEs from "./App.es.vue?raw";
import composableEn from "./useKeyboardShortcut.en.ts?raw";
import composableEs from "./useKeyboardShortcut.es.ts?raw";
import composableSolutionEn from "./useKeyboardShortcut.solution.en.ts?raw";
import composableSolutionEs from "./useKeyboardShortcut.solution.es.ts?raw";
import testEn from "./useKeyboardShortcut.test.en.ts?raw";
import testEs from "./useKeyboardShortcut.test.es.ts?raw";

export function createKeyboardShortcutListenerChallenge(locale: string): WebContainerChallenge {
  const en = locale === "en";
  return {
    id: "keyboard-shortcut-listener",
    files: [
      {
        content: en ? composableEn : composableEs,
        editable: true,
        icon: "ts",
        label: "useKeyboardShortcut.ts",
        path: "src/useKeyboardShortcut.ts",
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
        content: en ? testEn : testEs,
        editable: false,
        icon: "test",
        label: "useKeyboardShortcut.test.ts",
        path: "src/useKeyboardShortcut.test.ts",
      },
    ],
  };
}
