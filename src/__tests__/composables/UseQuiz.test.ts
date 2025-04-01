import {expect, describe, it, beforeEach} from "vitest";
import { effectScope, nextTick, type Ref, type ComputedRef } from "vue";
import useQuiz from "../../composables/useQuiz";
import quizMock from "../__mocks__/quizMock";
import type { Question, Answer } from "../../types/quiz";

interface QuizComposable {
  quizInit: Ref<Boolean>;
  quizProgress: Ref<number>;
  currentQuestionIndex: Ref<number>;
  currentQuestion: ComputedRef<Question | null>;
  selectedOption: Ref<number | null>;
  checkAnswer: Ref<boolean>;
  userStats: Ref<{ correct: number; wrong: number; percentage: number; total: number }>;
  userHistory: Ref<Array<{
    question: { en: string; es: string };
    answers: Array<Answer & { isSelected: boolean }>;
    explanation: { en: string; es: string };
    codeExample: { en: string; es: string };
  }>>;
  isLastQuestion: ComputedRef<boolean>;
  isFinished: Ref<boolean>;
  handleUserAnswer: () => void;
  handleNextQuestion: () => void;
}

describe("useQuiz", () => {
  let quizComposable: QuizComposable;

  beforeEach(() => {
    effectScope().run(() => {
      quizComposable = useQuiz(quizMock);
    });
  })

  it("should throw an error if no quiz is provided", () => {
    expect(() => {
      effectScope().run(() => {
        useQuiz(null);
      });
    }).toThrow("No quiz provided");
  });

  it("should initialize with correct default values", () => {
    let quizComposable;
    effectScope().run(() => {
      quizComposable = useQuiz(quizMock);
    });

    expect(quizComposable.quizInit.value).toBe(false);
    expect(quizComposable.currentQuestionIndex.value).toBe(0);
    expect(quizComposable.quizProgress.value).toBe(0);
    expect(quizComposable.selectedOption.value).toBe(null);
    expect(quizComposable.checkAnswer.value).toBe(false);
    expect(quizComposable.isFinished.value).toBe(false);
    expect(quizComposable.userStats.value).toEqual({
      correct: 0,
      wrong: 0,
      percentage: 0,
      total: 0,
    });
  });

  it("should init the quiz", () => {
    quizComposable.quizInit.value = true;

    expect(quizComposable.quizInit.value).toBe(true);
  });

  it("should return the correct current question", () => {
    expect(quizComposable.currentQuestion.value).toEqual(quizMock.questions[0]);
  
    quizComposable.currentQuestionIndex.value = 1;
    expect(quizComposable.currentQuestion.value).toEqual(quizMock.questions[1]);
  });

  it("should update userHistory on answering a question", () => {
    quizComposable.selectedOption.value = quizMock.questions[0].answers[0].id;
    quizComposable.handleUserAnswer();
  
    expect(quizComposable.userHistory.value.length).toBe(1);
    expect(quizComposable.checkAnswer.value).toBe(true);
  });

  it("should go to the next question when handleNextQuestion is called", () => {
    quizComposable.handleNextQuestion();
    expect(quizComposable.currentQuestionIndex.value).toBe(1);
    expect(quizComposable.quizProgress.value).toBe((2 / quizMock.questions.length) * 100);
  });

  it("should finish the quiz and calculate stats", async () => {
    for (let i = 0; i < quizMock.questions.length; i++) {
      quizComposable.selectedOption.value = quizMock.questions[i].answers[0].id; 
      quizComposable.handleUserAnswer(); // Llama a handleUserAnswer para registrar la respuesta
  
      quizComposable.handleNextQuestion();
      await nextTick();
    }
  
    expect(quizComposable.isFinished.value).toBe(true);
  
    expect(quizComposable.userStats.value.total).toBe(quizMock.questions.length);
    expect(quizComposable.userStats.value.correct).toBeGreaterThanOrEqual(0);
    expect(quizComposable.userStats.value.wrong).toBeGreaterThanOrEqual(0);
    expect(quizComposable.userStats.value.percentage).toBeGreaterThanOrEqual(0);
    expect(Number.isInteger(quizComposable.userStats.value.percentage)).toBe(true);
  });
});