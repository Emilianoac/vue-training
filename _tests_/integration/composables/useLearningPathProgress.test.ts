import { beforeEach, describe, expect, it } from "vitest";
import { clearNuxtState } from "#imports";
import type { LearningPath } from "@/schemas/learningPath.schema";
import { useLearningPathProgress } from "@/composables/learning-path/useLearningPathProgress";

const learningPath: LearningPath = {
  documentId: "vue-path",
  title: "Vue path",
  steps: [
    {
      name: "Reactivity",
      sub_steps: [
        {
          id: "reactivity-basics",
          name: "Reactivity basics",
          items: [
            {
              id: "reactive-state",
              type: "lesson",
              level: "basic",
              title: "Reactive state",
              subtitle: "Learn reactive state",
            },
            {
              id: "reactive-state-quiz",
              type: "quiz",
              level: "basic",
              title: "Reactive state quiz",
              subtitle: "Check your knowledge",
            },
          ],
        },
      ],
    },
  ],
};

describe("useLearningPathProgress", () => {
  beforeEach(() => {
    clearNuxtState("lp-progress");
    localStorage.clear();
  });

  it("marks and persists a completed activity", () => {
    const { isCompleted, markComplete } = useLearningPathProgress();

    markComplete("vue-path", "lesson", "reactive-state");

    expect(isCompleted("vue-path", "lesson", "reactive-state").value).toBe(true);
    expect(JSON.parse(localStorage.getItem("learning-path-progress") ?? "{}")).toEqual({
      "vue-path:lesson:reactive-state": true,
    });
  });

  it("marks a completed activity as incomplete", () => {
    const { isCompleted, markComplete, markIncomplete } = useLearningPathProgress();

    markComplete("vue-path", "lesson", "reactive-state");
    markIncomplete("vue-path", "lesson", "reactive-state");

    expect(isCompleted("vue-path", "lesson", "reactive-state").value).toBe(false);
    expect(JSON.parse(localStorage.getItem("learning-path-progress") ?? "{}")).toEqual({});
  });

  it("calculates completed items and progress percentage", () => {
    const { markComplete, useProgress } = useLearningPathProgress();
    const progress = useProgress("vue-path", learningPath);

    markComplete("vue-path", "lesson", "reactive-state");

    expect(progress.allItems.value).toHaveLength(2);
    expect(progress.completedCount.value).toBe(1);
    expect(progress.progressPercent.value).toBe(50);
  });

  it("returns zero progress when the path is missing", () => {
    const { useProgress } = useLearningPathProgress();
    const progress = useProgress("vue-path", null);

    expect(progress.allItems.value).toEqual([]);
    expect(progress.completedCount.value).toBe(0);
    expect(progress.progressPercent.value).toBe(0);
  });
});
