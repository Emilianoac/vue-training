import { describe, expect, it } from "vitest";
import {
  hasPassedLearningPathQuiz,
  LEARNING_PATH_QUIZ_PASS_PERCENTAGE,
} from "@/domain/quiz/learningPathQuizCompletion";

describe("learning path quiz completion", () => {
  it("passes when the score reaches the required percentage", () => {
    expect(hasPassedLearningPathQuiz(LEARNING_PATH_QUIZ_PASS_PERCENTAGE)).toBe(true);
  });

  it("does not pass below the required percentage", () => {
    expect(hasPassedLearningPathQuiz(LEARNING_PATH_QUIZ_PASS_PERCENTAGE - 0.01)).toBe(false);
  });
});
