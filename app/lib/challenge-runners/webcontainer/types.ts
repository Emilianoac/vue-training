import type { WebContainerAddonId } from "./addons";

export type ChallengeFile = {
  content: string;
  editable: boolean;
  icon: "js" | "test" | "ts" | "vue";
  label: string;
  path: string;
  preview?: boolean;
  solution?: string;
};

export type EditorFileTab = Pick<ChallengeFile, "icon" | "label" | "path">;

export type EditorSolutionFile = EditorFileTab & {
  solution: string;
};

export type WebContainerChallenge = {
  addons?: WebContainerAddonId[];
  entry?: string;
  files: ChallengeFile[];
  id: string;
};

export type TestCaseResult = {
  name: string;
  status: "failed" | "passed";
};

export type TestSummary = {
  failed: number;
  passed: number;
  total: number;
};

export type RunnerTimings = {
  boot: number | null;
  cacheRead: number | null;
  cacheWrite: number | null;
  install: number | null;
  mount: number | null;
  preview: number | null;
  total: number | null;
};

export type RunnerStatus = "booting" | "installing" | "ready" | "idle";
