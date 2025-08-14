
import type { RecordAnswerUseCase } from "./recordAnswerUseCase.interface";

export const recordAnswerUseCase: RecordAnswerUseCase = (question, selectedOptionId) => {

  const mappedAnswers = question.answers.map(answer => ({
    ...answer,
    isSelected: answer.id === selectedOptionId
  }));
  
  return {
    question: question.questionText,
    answers: mappedAnswers,
    explanation: question.correctAnswerExplanation,
    codeExample: question.correctAnswerCodeExample
  };
}