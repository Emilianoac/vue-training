import type { AnswerRecord } from "@/schemas/quiz.schema";

export type CalculateStatsUseCase = (userHistory: AnswerRecord[]) => {
  correct: number;
  wrong: number;
  percentage: number;
  total: number;
};
