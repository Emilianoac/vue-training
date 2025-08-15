import { ref, computed } from "vue";
import getQuizService from "@/services/api/get-quiz/getQuizService";
import { calculateStatsUseCase } from "@/services/use-cases/quiz/calculate-stats/calculateStatsUseCase";
import { recordAnswerUseCase } from "@/services/use-cases/quiz/record-answer/recordAnswerUseCase";
import type { Quiz, AnswerRecord } from "@/types/quiz";

export default function useQuiz() {
  const quiz = ref<Quiz | null>(null);
  const error = ref({ status: false, message: "" });
  const showDetails = ref(false);
  const isQuizInitialized = ref(false);
  const quizProgress = ref(0);
  const currentQuestionIndex = ref(0);
  const selectedOptionId = ref<number | null>(null);
  const hasCheckedAnswer = ref(false);
  const isFinished = ref(false);
  const startTime = ref<number | null>(null);
  const endTime = ref<number | null>(null);
  
  const userHistory = ref<AnswerRecord[]>([]);
  const userStats = ref({ correct: 0, wrong: 0, percentage: 0, total: 0 });

  const currentQuestion = computed(() =>
    quiz.value ? quiz.value.questions[currentQuestionIndex.value] : null
  );

  const isLastQuestion = computed(() => 
    quiz.value ? currentQuestionIndex.value === quiz.value.questions.length - 1 : false
  );

  const elapsedTime = computed(() => {
    if (startTime.value && endTime.value) {
      return Math.floor((endTime.value - startTime.value) / 1000);
    }
    return 0;
  });

  async function loadQuiz(id: string) {
    try {
      const quizData = await getQuizService(id);
      quiz.value = quizData;
      resetQuizState();
    } catch (err) {
      setError(err);
    }
  }

  function startQuiz() {
    isQuizInitialized.value = true;
    startTime.value = Date.now();
  }

  function answerCurrentQuestion() {
    if (!currentQuestion.value) {
      setError("No current question available.");
      return;
    }

    const newAnswerRecord = recordAnswerUseCase(currentQuestion.value, selectedOptionId.value);
    userHistory.value.push(newAnswerRecord);
    hasCheckedAnswer.value = true;
  }

  function goToNextQuestion() {
    if (isLastQuestion.value) {
      finishQuiz();
      return;
    }

    incrementQuestionIndex();
    resetQuestionState();
  }

  function incrementQuestionIndex() {
    if (!quiz.value) {
      setError("Quiz data is not loaded.");
      return;
    }
    currentQuestionIndex.value++;
    quizProgress.value = ((currentQuestionIndex.value + 1) / quiz.value.questions.length) * 100;
  }
  
  function resetQuestionState() {
    selectedOptionId.value = null;
    hasCheckedAnswer.value = false;
  }

  function resetQuizState() {
    quizProgress.value = 0;
    currentQuestionIndex.value = 0;
    selectedOptionId.value = null;
    hasCheckedAnswer.value = false;
    isFinished.value = false;
    userHistory.value = [];
    userStats.value = { correct: 0, wrong: 0, percentage: 0, total: 0 };
    startTime.value = Date.now();
    endTime.value = null;
  }

  function finishQuiz() {
    endTime.value = Date.now();
    isFinished.value = true;
    userStats.value = calculateStatsUseCase(userHistory.value);
  }

  function setError(err: unknown) {
    error.value.status = true;
    error.value.message = err instanceof Error ? err.message : "An unexpected error occurred";
  }

  return {
    quiz,
    error,
    showDetails,
    isQuizInitialized,
    quizProgress,
    currentQuestionIndex,
    currentQuestion,
    selectedOptionId,
    hasCheckedAnswer,
    userStats,
    userHistory,
    isLastQuestion,
    isFinished,
    elapsedTime,

    startQuiz,
    resetQuizState,
    loadQuiz,
    answerCurrentQuestion,
    goToNextQuestion,
  };
}
