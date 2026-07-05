import { beforeEach, describe, expect, it, vi } from "vitest";
import { ref } from "vue";
import type { Quiz, Answer } from "@/schemas/quiz.schema";

const { useQuizDataMock } = vi.hoisted(() => ({
  useQuizDataMock: vi.fn(),
}));

vi.mock("@/composables/quiz/useQuizData", () => ({
  default: useQuizDataMock,
}));

import useQuiz from "@/composables/quiz/useQuizGame";

const quiz: Quiz = {
  documentId: "reactivity-quiz",
  title: "Reactivity",
  slug: "reactivity",
  level: "basic",
  description: "Test your reactivity knowledge",
  category: {
    name: "Reactivity",
    image: { url: "/reactivity.svg" },
  },
  questions: [
    {
      text: "Which API creates a ref?",
      explanation: "Use ref.",
      explanation_code: [],
      answers: [
        { id: "ref", text: "ref", isCorrect: true },
        { id: "reactive", text: "reactive", isCorrect: false },
      ],
    },
    {
      text: "How is a ref read in JavaScript?",
      explanation: "Use .value.",
      explanation_code: [],
      answers: [
        { id: "direct", text: "Directly", isCorrect: false },
        { id: "value", text: "With .value", isCorrect: true },
      ],
    },
  ],
};

function arrangeQuiz() {
  const quizRef = ref<Quiz>();
  const error = ref({ status: false, message: "" });
  const getQuiz = vi.fn(async () => {
    quizRef.value = quiz;
  });

  useQuizDataMock.mockReturnValue({
    quiz: quizRef,
    error,
    getQuiz,
  });

  return { error, getQuiz, quizRef };
}

describe("useQuiz", () => {
  beforeEach(() => {
    vi.useRealTimers();
    useQuizDataMock.mockReset();
  });

  it("loads a quiz and exposes its first question", async () => {
    const { getQuiz } = arrangeQuiz();
    const game = useQuiz();

    await game.actions.loadQuiz("reactivity");

    expect(getQuiz).toHaveBeenCalledWith("reactivity");
    expect(game.totalQuestions.value).toBe(2);
    expect(game.currentQuestion.value?.text).toBe(quiz.questions[0]?.text);
    expect(game.currentCorrectAnswer.value?.id).toBe("ref");
  });

  it("starts the quiz after the loading delay", () => {
    vi.useFakeTimers();
    arrangeQuiz();
    const { actions, state } = useQuiz();

    actions.startQuiz();

    expect(state.quizState).toMatchObject({
      isInitialized: true,
      isLoading: true,
    });

    vi.advanceTimersByTime(3000);

    expect(state.quizState.isLoading).toBe(false);
    expect(state.startTime).toEqual(expect.any(Number));
  });

  it("records an answer and advances to the next question", async () => {
    arrangeQuiz();
    const game = useQuiz();
    await game.actions.loadQuiz("reactivity");

    game.state.answer.selectedOptionId = "ref";
    game.actions.answerCurrentQuestion();
    game.actions.goToNextQuestion();

    expect(game.state.result.history).toHaveLength(1);
    expect(game.state.result.history[0]?.answers.find((answer) => answer.isSelected)?.id).toBe(
      "ref",
    );
    expect(game.state.progress.currentQuestionIndex).toBe(1);
    expect(game.state.progress.percentage).toBe(100);
    expect(game.state.answer).toEqual({
      selectedOptionId: null,
      hasCheckedAnswer: false,
    });
  });

  it("finishes the quiz and calculates the result", async () => {
    arrangeQuiz();
    const game = useQuiz();
    await game.actions.loadQuiz("reactivity");

    game.state.answer.selectedOptionId = "ref";
    game.actions.answerCurrentQuestion();
    game.actions.goToNextQuestion();
    game.state.answer.selectedOptionId = "direct";
    game.actions.answerCurrentQuestion();
    game.actions.goToNextQuestion();

    expect(game.state.quizState.isFinished).toBe(true);
    expect(game.state.result.stats).toEqual({
      correct: 1,
      wrong: 1,
      percentage: 50,
      total: 2,
    });
    expect(game.elapsedTime.value).toEqual(expect.any(Number));
  });

  it("reports an error when answering without a loaded quiz", () => {
    const { error } = arrangeQuiz();
    const game = useQuiz();

    game.actions.answerCurrentQuestion();

    expect(error.value).toEqual({
      status: true,
      message: "No current question available.",
    });
  });
});
