import { describe, expect, it } from "vitest";
import type { Question } from "@/schemas/quiz.schema";
import { recordQuizAnswer } from "@/domain/quiz/recordQuizAnswer";

const question: Question = {
  text: "Which answer is correct?",
  explanation: "The second answer is correct.",
  explanation_code: [{ code: "const answer = 2", language: "ts" }],
  answers: [
    { id: "first", isCorrect: false, text: "First" },
    { id: "second", isCorrect: true, text: "Second" },
  ],
};

describe("recordQuizAnswer", () => {
  it("marks only the selected answer", () => {
    const result = recordQuizAnswer(question, "second");

    expect(result.answers).toEqual([
      { ...question.answers[0], isSelected: false },
      { ...question.answers[1], isSelected: true },
    ]);
  });

  it("preserves the question details", () => {
    expect(recordQuizAnswer(question, "first")).toMatchObject({
      question: question.text,
      explanation: question.explanation,
      codeExample: question.explanation_code,
    });
  });

  it.each([null, "missing"])("leaves every answer unselected for %s", (selection) => {
    const result = recordQuizAnswer(question, selection);

    expect(result.answers.every((answer) => !answer.isSelected)).toBe(true);
  });

  it("does not mutate the original question", () => {
    recordQuizAnswer(question, "second");

    expect(question.answers).not.toHaveProperty("0.isSelected");
  });
});
