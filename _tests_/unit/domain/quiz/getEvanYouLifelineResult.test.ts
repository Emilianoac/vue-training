import { describe, expect, it } from "vitest";
import { getEvanYouLifelineResult } from "@/domain/quiz/getEvanYouLifelineResult";
import type { Answer } from "@/schemas/quiz.schema";

const answers: Answer[] = [
  { id: "a", text: "A", isCorrect: false },
  { id: "b", text: "B", isCorrect: true },
  { id: "c", text: "C", isCorrect: false },
  { id: "d", text: "D", isCorrect: false },
];

describe("getEvanYouLifelineResult", () => {
  it("keeps the correct answer and one deterministic distractor", () => {
    const result = getEvanYouLifelineResult(answers, () => 0.5);

    expect(result.remainingOptionIds).toEqual(["b", "c"]);
    expect(result.eliminatedOptionIds).toEqual(["a", "d"]);
  });

  it("does not remove options when only two answers are available", () => {
    const result = getEvanYouLifelineResult(answers.slice(0, 2), () => 0);

    expect(result.remainingOptionIds).toEqual(["a", "b"]);
    expect(result.eliminatedOptionIds).toEqual([]);
  });
});
