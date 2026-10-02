export const QUIZ_PASS_PERCENTAGE = 70;

export type QuizOutcome = "failed" | "passed" | "perfect";

export function getQuizOutcome(
  percentage: number,
  requiredPercentage = QUIZ_PASS_PERCENTAGE,
): QuizOutcome {
  if (percentage === 100) return "perfect";
  if (percentage >= requiredPercentage) return "passed";
  return "failed";
}
