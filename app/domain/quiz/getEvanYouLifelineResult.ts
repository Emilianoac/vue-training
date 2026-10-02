import type { Answer } from "@/schemas/quiz.schema";

export type EvanYouLifelineResult = {
  eliminatedOptionIds: string[];
  remainingOptionIds: string[];
};

export function getEvanYouLifelineResult(
  answers: Answer[],
  random: () => number = Math.random,
): EvanYouLifelineResult {
  const correctAnswer = answers.find((answer) => answer.isCorrect);
  const incorrectAnswers = answers.filter((answer) => !answer.isCorrect);

  if (!correctAnswer || incorrectAnswers.length <= 1) {
    return {
      eliminatedOptionIds: [],
      remainingOptionIds: answers.map((answer) => answer.id),
    };
  }

  const randomIndex = Math.min(
    Math.floor(random() * incorrectAnswers.length),
    incorrectAnswers.length - 1,
  );
  const remainingDistractor = incorrectAnswers[randomIndex];

  if (!remainingDistractor) {
    return {
      eliminatedOptionIds: [],
      remainingOptionIds: answers.map((answer) => answer.id),
    };
  }

  const remainingOptionIds = [correctAnswer.id, remainingDistractor.id];

  return {
    eliminatedOptionIds: answers
      .filter((answer) => !remainingOptionIds.includes(answer.id))
      .map((answer) => answer.id),
    remainingOptionIds,
  };
}
