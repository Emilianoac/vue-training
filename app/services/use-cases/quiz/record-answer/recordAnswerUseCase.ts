import type { RecordAnswerUseCase } from "./recordAnswerUseCase.interface";

export const recordAnswerUseCase: RecordAnswerUseCase = (question, selectedOptionId) => {
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
};
