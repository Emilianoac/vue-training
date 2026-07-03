import type { AnswerRecord } from "@/schemas/quiz.schema";

export function calculateQuizStats(userHistory: AnswerRecord[]) {
  const correct = userHistory.filter((entry) =>
    entry.answers.some((answer) => answer.isSelected && answer.isCorrect),
  ).length;
  const wrong = userHistory.length - correct;
  const total = userHistory.length;
  const percentage = total > 0 ? (correct / total) * 100 : 0;

  return {
    correct,
    wrong,
    percentage,
    total,
  };
}
