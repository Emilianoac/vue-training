import { describe, expect, it } from "vitest";
import {
  getQuizOutcome,
  QUIZ_PASS_PERCENTAGE,
} from "@/domain/quiz/getQuizOutcome";

describe("quiz outcome", () => {
  it("returns perfect when every answer is correct", () => {
    expect(getQuizOutcome(100)).toBe("perfect");
  });

  it("returns passed when the score reaches the required percentage", () => {
    expect(getQuizOutcome(QUIZ_PASS_PERCENTAGE)).toBe("passed");
  });

  it("returns failed below the required percentage", () => {
    expect(getQuizOutcome(QUIZ_PASS_PERCENTAGE - 0.01)).toBe("failed");
  });
});
