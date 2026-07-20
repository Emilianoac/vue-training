import type { FileSystemTree } from "@webcontainer/api";
import type { ChallengeFile } from "./types";
import indexHtml from "./project-template/index.html?raw";
import mainSource from "./project-template/main.ts?raw";
import packageJson from "./project-template/package.json?raw";
import previewTheme from "./project-template/preview-theme.css?raw";
import viteConfig from "./project-template/vite.config.ts?raw";
import vitestConfig from "./project-template/vitest.config.ts?raw";

export const WEB_CONTAINER_TEMPLATE_VERSION = "vue-vitest-2026-07-1";
export const WEB_CONTAINER_SNAPSHOT_PATH = `/webcontainer/${WEB_CONTAINER_TEMPLATE_VERSION}.snapshot`;

export function createBaseProjectFiles(): FileSystemTree {
  return {
    "package.json": {
      file: {
        contents: packageJson,
      },
    },
    "vite.config.ts": {
      file: {
        contents: viteConfig,
      },
    },
    "vitest.config.ts": {
      file: {
        contents: vitestConfig,
      },
    },
    "index.html": {
      file: {
        contents: indexHtml,
      },
    },
  };
}

export function createChallengeProjectFiles(
  challengeFiles: ChallengeFile[],
  entrySource?: string,
): FileSystemTree {
  const projectFiles = createFileTree(challengeFiles);
  const previewFilePath = getPreviewFilePath(challengeFiles);

  // The preview entry must import the editable Vue file selected by each challenge.
  addFileToTree(
    projectFiles,
    ["src", "main.ts"],
    entrySource ?? mainSource.replace("__CHALLENGE_FILE__", previewFilePath),
  );

  // Mount the shared theme as a real file so Vite can load it without template placeholders.
  addFileToTree(projectFiles, ["src", "preview-theme.css"], previewTheme);

  return {
    ...projectFiles,
  };
}

export function createChallengePackageFiles(
  dependencies: Record<string, string>,
): FileSystemTree {
  const projectPackage = JSON.parse(packageJson) as {
    dependencies?: Record<string, string>;
    [key: string]: unknown;
  };

  return {
    "package.json": {
      file: {
        contents: JSON.stringify(
          {
            ...projectPackage,
            dependencies: {
              ...projectPackage.dependencies,
              ...dependencies,
            },
          },
          null,
          2,
        ),
      },
    },
  };
}

export function createProjectFiles(
  challengeFiles: ChallengeFile[],
  entrySource?: string,
): FileSystemTree {
  return {
    ...createBaseProjectFiles(),
    ...createChallengeProjectFiles(challengeFiles, entrySource),
  };
}

function createFileTree(files: ChallengeFile[]): FileSystemTree {
  const tree: FileSystemTree = {};

  for (const file of files) {
    addFileToTree(tree, file.path.split("/"), file.content);
  }

  return tree;
}

function getPreviewFilePath(files: ChallengeFile[]) {
  const previewFile = files.find((file) => file.preview);
  const editableVueFile = files.find((file) => file.editable && file.path.endsWith(".vue"));
  return (previewFile ?? editableVueFile)?.path.replace(/^src\//, "") ?? "Counter.vue";
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
  if (!directoryNode || !("directory" in directoryNode)) return;

  addFileToTree(directoryNode.directory, remainingParts, content);
}
