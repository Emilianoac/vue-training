import { defineVitestProject } from "@nuxt/test-utils/config";
import { configDefaults } from "vitest/config";

export default await defineVitestProject({
  test: {
    globals: true,
    environment: "nuxt",
    setupFiles: [
      "./setupTests.ts"
    ],
    exclude: [
      ...configDefaults.exclude,
      "e2e/*"
    ],
  },
})