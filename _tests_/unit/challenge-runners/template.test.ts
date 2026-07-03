import { describe, expect, it } from "vitest";
import { createProjectFiles } from "@/lib/challenge-runners/webcontainer/template";
import type { ChallengeFile } from "@/lib/challenge-runners/webcontainer/types";

function readFile(
  tree: ReturnType<typeof createProjectFiles>,
  ...path: string[]
): string {
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
  it("creates the shared Vue and Vitest project files", () => {
    const tree = createProjectFiles([]);
    const packageJson = JSON.parse(readFile(tree, "package.json"));

    expect(packageJson.scripts).toMatchObject({
      dev: "vite --host 0.0.0.0",
      test: expect.stringContaining("vitest run"),
    });
    expect(readFile(tree, "index.html")).toContain('src="/src/main.ts"');
    expect(readFile(tree, "vite.config.ts")).toContain("vue()");
    expect(readFile(tree, "vitest.config.ts")).toContain('environment: "happy-dom"');
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

    expect(readFile(tree, "src", "utils", "counter.ts")).toBe(
      "export const count = 0;",
    );
  });

  it("falls back to Counter.vue when there is no editable Vue file", () => {
    expect(readFile(createProjectFiles([]), "src", "main.ts")).toContain(
      'import Challenge from "./Counter.vue"',
    );
  });
});
