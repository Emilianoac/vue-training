
import "../../__mocks__/services/get-quiz/getQuizServiceMock"
import { getQuizServiceMock } from "../../__mocks__/services/get-quiz/getQuizServiceMock";
import sampleQuiz from "../../__sample-data__/sampleQuiz";

import {expect, describe, it, beforeEach, vi} from "vitest";
import useQuiz from "../../src/composables/useQuiz";

describe("useQuiz - API Interaction", () => {

  beforeEach(() => {
    getQuizServiceMock.mockClear();
  });


  it("should get quiz data", async() => {
    const { loadQuiz, quiz, error } = useQuiz();

    await loadQuiz("quiz-test-id");
    
    expect(quiz).not.toBeNull();
    expect(quiz.value).toEqual(sampleQuiz);
    expect(error.value.status).toBe(false);
  });

  it("should handle quiz not found error", async() => {
    getQuizServiceMock.mockRejectedValue(new Error("Quiz not found"));
    const { loadQuiz, error, quiz } = useQuiz();

    await loadQuiz("non-existent-quiz-id");
    
    expect(error.value.status).toBe(true);
    expect(error.value.message).toBe("Quiz not found");
  });
});

describe("useQuiz - composable state and flow", () => {
  let composable: ReturnType<typeof useQuiz>;

  beforeEach(() => {
    composable = useQuiz();
  });

  it("loads a quiz and resets state", async () => {
    composable.quiz.value = sampleQuiz;

    await composable.loadQuiz("quiz-test-id");

    expect(composable.quiz.value).toEqual(sampleQuiz);
    expect(composable.userHistory.value).toHaveLength(0);
    expect(composable.hasCheckedAnswer.value).toBe(false);
  });

  it("records that current question has been answered", () => {
    composable.quiz.value = sampleQuiz;
    composable.selectedOptionId.value = 1;

    composable.answerCurrentQuestion();

    expect(composable.hasCheckedAnswer.value).toBe(true);
    expect(composable.userHistory.value).toHaveLength(1);
  });

  it("navigates to next question", () => {
    composable.quiz.value = sampleQuiz;

    composable.goToNextQuestion();
    
    expect(composable.currentQuestionIndex.value).toBe(1);
  });

  it("finishes the quiz and calculates stats", () => {
    composable.quiz.value = sampleQuiz;
    composable.currentQuestionIndex.value = sampleQuiz.questions.length - 1;

    composable.goToNextQuestion();

    expect(composable.isFinished.value).toBe(true);
  });
});
