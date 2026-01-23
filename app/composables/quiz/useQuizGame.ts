import { calculateStatsUseCase } from "@/services/use-cases/quiz/calculate-stats/calculateStatsUseCase";
import { recordAnswerUseCase } from "@/services/use-cases/quiz/record-answer/recordAnswerUseCase";
import useQuizData from "./useQuizData";
import type { AnswerRecord } from "@/types/quiz";

export default function useQuiz() {
  const { getQuiz, quiz, error } = useQuizData();

  // State
  const state = reactive({
    quizState: {
      isInitialized: false,
      isLoading: false,
      isFinished: false
    },
    progress: {
      currentQuestionIndex: 0,
      percentage: 0
    },
    answer: {
      selectedOptionId: null as string | null,
      hasCheckedAnswer: false
    },
    result: {
      history: [] as AnswerRecord[],
      stats: { correct: 0, wrong: 0, percentage: 0, total: 0 }
    },
    startTime: null as number | null,
    endTime: null as number | null
  });

  // Derived
  const totalQuestions = computed(() => quiz.value?.questions.length ?? 0);

  const displayQuestionIndex = computed(() => state.progress.currentQuestionIndex + 1);

  const currentQuestion = computed(() =>
    quiz.value?.questions[state.progress.currentQuestionIndex] ?? null
  );

  const currentCorrectAnswer = computed(() => {
    const q = currentQuestion.value;
    if (!q) return null;

    return q.answers.find(a => a.isCorrect) ?? null;
  });
  
  const isLastQuestion = computed(() =>
    quiz.value ? state.progress.currentQuestionIndex === quiz.value.questions.length - 1 : false
  );

  const elapsedTime = computed(() =>
    state.startTime && state.endTime ? Math.floor((state.endTime - state.startTime) / 1000) : 0
  );

  // Actions
  const actions = {
    loadQuiz: async (id: string) => {
      try {
        await getQuiz(id);
        actions.resetQuizState();
      } catch (err) {
        setError(err);
      }
    },
    startQuiz: () => {
      state.quizState.isInitialized = true;
      state.quizState.isLoading = true;

      setTimeout(() => {
        state.quizState.isLoading = false;
        state.startTime = Date.now();
      }, 3000);
    },
    answerCurrentQuestion: () => {
      if (!currentQuestion.value) {
        setError("No current question available.");
        return;
      }
      const newAnswerRecord = recordAnswerUseCase(currentQuestion.value, state.answer.selectedOptionId);
      state.result.history.push(newAnswerRecord);
      state.answer.hasCheckedAnswer = true;
    },
    goToNextQuestion: () => {
      if (isLastQuestion.value) {
        finishQuiz();
        return;
      }
      incrementQuestionIndex();
      resetQuestionState();
    },
    resetQuizState: () => {
      state.progress.percentage = 0;
      state.progress.currentQuestionIndex = 0;
      state.answer.selectedOptionId = null;
      state.answer.hasCheckedAnswer = false;
      state.quizState.isFinished = false;
      state.result.history = [];
      state.result.stats = { correct: 0, wrong: 0, percentage: 0, total: 0 };
      state.startTime = Date.now();
      state.endTime = null;
    },
    leaveQuiz: (message: string) => {
      if (window.confirm(message)) window.location.reload();
    }
  };

  // Internal helpers
  function incrementQuestionIndex() {
    if (!quiz.value) {
      setError("Quiz data is not loaded.");
      return;
    }
    state.progress.currentQuestionIndex++;
    state.progress.percentage =
      ((state.progress.currentQuestionIndex + 1) / quiz.value.questions.length) * 100;
  }

  function resetQuestionState() {
    state.answer.selectedOptionId = null;
    state.answer.hasCheckedAnswer = false;
  }

  function finishQuiz() {
    state.endTime = Date.now();
    state.quizState.isFinished = true;
    state.result.stats = calculateStatsUseCase(state.result.history);
  }

  function setError(err: unknown) {
    error.value.status = true;
    error.value.message = err instanceof Error ? err.message : "An unexpected error occurred";
  }

  return {
    quiz,
    // State
    state,
    // derived
    totalQuestions,
    displayQuestionIndex,
    currentQuestion,
    currentCorrectAnswer,
    isLastQuestion,
    elapsedTime,
    // actions
    actions
  };
}
