import { describe, expect, it } from "vitest";
import {
  createBaseProjectFiles,
  createChallengePackageFiles,
  createChallengeProjectFiles,
  createProjectFiles,
} from "@/lib/challenge-runners/webcontainer/template";
import type { FileSystemTree } from "@webcontainer/api";
import type { ChallengeFile } from "@/lib/challenge-runners/webcontainer/types";

function readFile(tree: FileSystemTree, ...path: string[]): string {
  let current = tree;

  for (const [index, segment] of path.entries()) {
    const node = current[segment];
    if (!node) throw new Error(`Missing file tree entry: ${path.join("/")}`);

    if (index === path.length - 1) {
      if (!("file" in node)) throw new Error(`${path.join("/")} is not a file`);
      return String(node.file.contents);
    }

    if (!("directory" in node)) throw new Error(`${segment} is not a directory`);
    current = node.directory;
  }

  throw new Error("A file path is required");
}

describe("createProjectFiles", () => {
  it("keeps shared dependencies separate from challenge source files", () => {
    const baseFiles = createBaseProjectFiles();
    const challengeFiles = createChallengeProjectFiles([]);

    expect(baseFiles).toHaveProperty("package.json");
    expect(baseFiles).not.toHaveProperty("src");
    expect(challengeFiles).not.toHaveProperty("package.json");
    expect(challengeFiles).toHaveProperty("src");
  });

  it("creates the shared Vue and Vitest project files", () => {
    const tree = createProjectFiles([]);
    const packageJson = JSON.parse(readFile(tree, "package.json"));

    expect(packageJson.scripts).toMatchObject({
      dev: "node ./node_modules/vite/bin/vite.js --host 0.0.0.0",
      test: expect.stringContaining("vitest.mjs run"),
    });
    expect(readFile(tree, "index.html")).toContain('href="/src/preview-theme.css"');
    expect(readFile(tree, "index.html")).toContain('src="/src/main.ts"');
    expect(readFile(tree, "src", "preview-theme.css")).toContain("--background:");
    expect(readFile(tree, "vite.config.ts")).toContain("vue()");
    expect(readFile(tree, "vitest.config.ts")).toContain('environment: "happy-dom"');
  });

  it("extends the package file with challenge-specific dependencies", () => {
    const tree = createChallengePackageFiles({ "vue-router": "5.1.0" });
    const packageJson = JSON.parse(readFile(tree, "package.json"));

    expect(packageJson.dependencies).toMatchObject({
      vue: "3.5.38",
      "vue-router": "5.1.0",
    });
  });

  it("mounts the editable Vue file in the preview", () => {
    const files: ChallengeFile[] = [
      {
        path: "src/components/Challenge.vue",
        content: "<template>Challenge</template>",
        editable: true,
        icon: "vue",
        label: "Challenge.vue",
      },
    ];

    const tree = createProjectFiles(files);

    expect(readFile(tree, "src", "main.ts")).toContain(
      'import Challenge from "./components/Challenge.vue"',
    );
  });

  it("mounts the file explicitly selected for a multi-file preview", () => {
    const files: ChallengeFile[] = [
      {
        path: "src/Child.vue",
        content: "<template>Child</template>",
        editable: true,
        icon: "vue",
        label: "Child.vue",
      },
      {
        path: "src/App.vue",
        content: "<template>App</template>",
        editable: true,
        icon: "vue",
        label: "App.vue",
        preview: true,
      },
    ];

    const tree = createProjectFiles(files);

    expect(readFile(tree, "src", "main.ts")).toContain('import Challenge from "./App.vue"');
  });

  it("uses a challenge-specific project entry when provided", () => {
    const entry = 'import { createApp } from "vue";\ncreateApp({}).mount("#app");';
    const tree = createProjectFiles([], entry);

    expect(readFile(tree, "src", "main.ts")).toBe(entry);
  });

  it("preserves nested challenge files and their contents", () => {
    const files: ChallengeFile[] = [
      {
        path: "src/utils/counter.ts",
        content: "export const count = 0;",
        editable: false,
        icon: "ts",
        label: "counter.ts",
      },
    ];

    const tree = createProjectFiles(files);

    expect(readFile(tree, "src", "utils", "counter.ts")).toBe("export const count = 0;");
  });

  it("falls back to Counter.vue when there is no editable Vue file", () => {
    expect(readFile(createProjectFiles([]), "src", "main.ts")).toContain(
      'import Challenge from "./Counter.vue"',
    );
  });
});
