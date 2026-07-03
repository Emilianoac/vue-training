import type { AnswerRecord, Question } from "@/schemas/quiz.schema";

export function recordQuizAnswer(
  question: Question,
  selectedOptionId: string | null,
): AnswerRecord {
  const mappedAnswers = question.answers.map((answer) => ({
    ...answer,
    isSelected: answer.id === selectedOptionId,
  }));

  return {
    question: question.text,
    answers: mappedAnswers,
    explanation: question.explanation,
    codeExample: question.explanation_code,
  };
}
