import type { Quiz, AnswerRecord, Question } from "@/schemas/quiz.schema";

export type RecordAnswerUseCase = (
  question: Question,
  selectedOptionId: string | null,
) => AnswerRecord;
