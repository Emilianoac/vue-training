import { describe, expect, it } from "vitest";
import type { AnswerRecord } from "@/schemas/quiz.schema";
import { calculateQuizStats } from "@/domain/quiz/calculateQuizStats";

function createAnswerRecord(isCorrect: boolean): AnswerRecord {
  return {
    question: "Question",
    answers: [
      {
        id: "answer",
        isCorrect,
        isSelected: true,
        text: "Answer",
      },
    ],
    explanation: "Explanation",
    codeExample: [],
  };
}

describe("calculateQuizStats", () => {
  it("returns empty stats when there are no answers", () => {
    expect(calculateQuizStats([])).toEqual({
      correct: 0,
      wrong: 0,
      percentage: 0,
      total: 0,
    });
  });

  it("calculates stats for a mixed answer history", () => {
    const history = [
      createAnswerRecord(true),
      createAnswerRecord(false),
      createAnswerRecord(true),
    ];

    expect(calculateQuizStats(history)).toEqual({
      correct: 2,
      wrong: 1,
      percentage: 66.67,
      total: 3,
    });
  });

  it("only counts a correct answer when it was selected", () => {
    const record = createAnswerRecord(true);
    record.answers[0]!.isSelected = false;

    expect(calculateQuizStats([record])).toMatchObject({
      correct: 0,
      wrong: 1,
      percentage: 0,
    });
  });
});
