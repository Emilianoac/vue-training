import { describe, expect, it } from "vitest";
import { findActiveLessonSection } from "@/composables/lesson/useLessonScrollSpy";

const sections = [
  { id: "introduction", top: 20 },
  { id: "state", top: 240 },
  { id: "actions", top: 480 },
];

describe("lesson scroll spy", () => {
  it("keeps the first section active before crossing another heading", () => {
    expect(findActiveLessonSection(sections, 100)).toBe("introduction");
  });

  it("activates the last section that crossed the activation line", () => {
    expect(findActiveLessonSection(sections, 300)).toBe("state");
    expect(findActiveLessonSection(sections, 600)).toBe("actions");
  });

  it("activates the last section when the viewport reaches the bottom", () => {
    expect(findActiveLessonSection(sections, 300, true)).toBe("actions");
  });

  it("handles an empty lesson", () => {
    expect(findActiveLessonSection([], 100)).toBe("");
  });
});
