
import type { AnswerRecord } from "@/types/quiz";

export type CalculateStatsUseCase = (userHistory: AnswerRecord[]) => {
  correct: number;
  wrong: number;
  percentage: number;
  total: number;
};