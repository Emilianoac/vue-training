import { fileURLToPath } from "node:url";
import { defineVitestProject } from "@nuxt/test-utils/config";
import { defineConfig } from "vitest/config";

const appAliases = {
  "@": fileURLToPath(new URL("./app", import.meta.url)),
  "~": fileURLToPath(new URL("./app", import.meta.url)),
};

export default defineConfig({
  resolve: {
    alias: appAliases,
  },
  test: {
    projects: [
      {
        resolve: {
          alias: appAliases,
        },
        test: {
          name: "unit",
          include: ["_tests_/unit/**/*.{test,spec}.ts"],
          environment: "node",
          css: {
            include: [/preview-theme\.css/],
          },
        },
      },
      await defineVitestProject({
        test: {
          name: "integration",
          include: ["_tests_/integration/**/*.{test,spec}.ts"],
          environment: "nuxt",
          setupFiles: ["./_tests_/integration/setup.ts"],
          environmentOptions: {
            nuxt: {
              mock: {
                indexedDb: true,
              },
            },
          },
        },
      }),
    ],
  },
});
