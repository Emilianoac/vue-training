export const LEARNING_PATH_QUIZ_PASS_PERCENTAGE = 70;

export function hasPassedLearningPathQuiz(
  percentage: number,
  requiredPercentage = LEARNING_PATH_QUIZ_PASS_PERCENTAGE,
) {
  return percentage >= requiredPercentage;
}
