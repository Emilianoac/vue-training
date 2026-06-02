export type ChallengeFile = {
  content: string;
  editable: boolean;
  icon: "js" | "test" | "ts" | "vue";
  label: string;
  path: string;
  solution?: string;
};

export type WebContainerChallenge = {
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

export type RunnerStatus = "booting" | "installing" | "ready" | "idle";
