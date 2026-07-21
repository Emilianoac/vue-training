import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  createActivityPath,
  consumeLearningPathSection,
  getLearningPathReturnPath,
  rememberLearningPathSection,
} from "@/composables/learning-path/useLearningPathNavigation";

describe("learning path navigation", () => {
  beforeEach(() => {
    const values = new Map<string, string>();
    vi.stubGlobal("sessionStorage", {
      getItem: (key: string) => values.get(key) ?? null,
      removeItem: (key: string) => values.delete(key),
      setItem: (key: string, value: string) => values.set(key, value),
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("includes the originating section in an activity URL", () => {
    expect(
      createActivityPath("vue-3-path", "lesson", "watchers-lesson"),
    ).toBe("/learn/learning-path/vue-3-path/lessons/watchers-lesson");
  });

  it("uses a clean learning path return URL", () => {
    expect(getLearningPathReturnPath()).toBe("/learn/learning-paths");
  });

  it("stores and consumes the originating section once", () => {
    rememberLearningPathSection("vue-3-path", "watchers");

    expect(consumeLearningPathSection("vue-3-path")).toBe("watchers");
    expect(consumeLearningPathSection("vue-3-path")).toBeNull();
  });

  it("does not store an invalid section id", () => {
    rememberLearningPathSection("vue-3-path", "../../quizzes");

    expect(consumeLearningPathSection("vue-3-path")).toBeNull();
  });
});
