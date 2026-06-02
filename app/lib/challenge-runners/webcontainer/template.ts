import type { FileSystemTree } from "@webcontainer/api";
import type { ChallengeFile } from "./types";

export const WEB_CONTAINER_TEMPLATE_VERSION = "vue-vitest-2026-05";
const previewTheme = `<style type="text/tailwindcss">
  :root {
    --background: oklch(1 0 0);
    --foreground: oklch(0.1511 0.0178 224.4773);
    --card: oklch(0.9751 0.0055 183.0314);
    --card-foreground: oklch(0.1511 0.0178 224.4773);
    --primary: oklch(0.815 0.1706 151.2684);
    --primary-foreground: oklch(0.1793 0.0204 233.0961);
    --muted: oklch(0.9396 0.0202 229.0448);
    --muted-foreground: oklch(0.4001 0.0301 230.0598);
    --accent: oklch(0.9192 0.0162 187.3124);
    --accent-foreground: oklch(0 0 0);
    --border: oklch(0.9477 0.0085 225.084);
    --ring: oklch(0.6126 0.1866 252.6519);
  }

  .dark {
    --background: oklch(0.2077 0.0398 265.7549);
    --foreground: oklch(0.9205 0.0086 225.0879);
    --card: oklch(0.2513 0.0395 268.7473);
    --card-foreground: oklch(0.9205 0.0086 225.0879);
    --primary: oklch(0.815 0.1706 151.2684);
    --primary-foreground: oklch(0.1206 0.0243 231.0225);
    --muted: oklch(0.1394 0.0106 220.3811);
    --muted-foreground: oklch(0.6498 0.03 229.4501);
    --accent: oklch(0.2552 0.0415 267.5355);
    --accent-foreground: oklch(0.9499 0.0195 260.1697);
    --border: oklch(0.2824 0.0229 224.7083);
    --ring: oklch(0.6126 0.1866 252.6519);
  }
</style>`;

export function createProjectFiles(challengeFiles: ChallengeFile[]): FileSystemTree {
  const projectFiles = createFileTree(challengeFiles);

  addFileToTree(
    projectFiles,
    ["src", "main.ts"],
    `import { createApp } from "vue";
import Challenge from "./Counter.vue";

createApp(Challenge).mount("#app");
`,
  );

  return {
    "package.json": {
      file: {
        contents: JSON.stringify(
          {
            type: "module",
            scripts: {
              dev: "vite --host 0.0.0.0",
              test: "vitest run --reporter=verbose --reporter=json --outputFile=vitest-results.json",
            },
            dependencies: {
              "@vitejs/plugin-vue": "6.0.4",
              "@vue/test-utils": "2.4.6",
              "happy-dom": "20.0.11",
              "vite": "7.3.1",
              "vitest": "3.2.0",
              "vue": "3.5.25",
            },
            devDependencies: {},
          },
          null,
          2,
        ),
      },
    },
    "vite.config.ts": {
      file: {
        contents: `import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [vue()],
});
`,
      },
    },
    "vitest.config.ts": {
      file: {
        contents: `import { defineConfig } from "vitest/config";
import viteConfig from "./vite.config";

export default defineConfig({
  ...viteConfig,
  test: {
    environment: "happy-dom",
  },
});
`,
      },
    },
    "index.html": {
      file: {
        contents: `<div id="app"></div>
<script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4.1.8"></script>
${previewTheme}
<script type="module" src="/src/main.ts"></script>
`,
      },
    },
    ...projectFiles,
  };
}

function createFileTree(files: ChallengeFile[]): FileSystemTree {
  const tree: FileSystemTree = {};

  for (const file of files) {
    addFileToTree(tree, file.path.split("/"), file.content);
  }

  return tree;
}

function addFileToTree(tree: FileSystemTree, pathParts: string[], content: string) {
  const [currentPart, ...remainingParts] = pathParts;
  if (!currentPart) return;

  if (remainingParts.length === 0) {
    tree[currentPart] = {
      file: {
        contents: content,
      },
    };
    return;
  }

  const currentNode = tree[currentPart];

  if (!currentNode || !("directory" in currentNode)) {
    tree[currentPart] = {
      directory: {},
    };
  }

  const directoryNode = tree[currentPart];
  if (!("directory" in directoryNode)) return;

  addFileToTree(directoryNode.directory, remainingParts, content);
}
