import { ref, computed } from "vue";
import type { Quiz, Answer, CodeExample } from "@/types/quiz";
import getQuizService from "@/services/api/get-quiz/getQuizService";

interface UserHistory {
  question: { en: string; es: string };
  answers: Array<Answer & { isSelected: boolean }>;
  explanation: { en: string; es: string };
  codeExample: { en: CodeExample[]; es: CodeExample[] };
}

export default function useQuiz() {
  const quiz = ref<Quiz | null>(null);
  const error = ref({ status: false, message: "" });
  const isQuizInitialized = ref(false);
  const quizProgress = ref(0);
  const currentQuestionIndex = ref(0);
  const selectedOptionId = ref<number | null>(null);
  const hasCheckedAnswer = ref(false);
  const isFinished = ref(false);

  const userHistory = ref<UserHistory[]>([]);
  const userStats = ref({ correct: 0, wrong: 0, percentage: 0, total: 0 });

  const currentQuestion = computed(() =>
    quiz.value ? quiz.value.questions[currentQuestionIndex.value] : null
  );

  const isLastQuestion = computed(() => 
    quiz.value ? currentQuestionIndex.value === quiz.value.questions.length - 1 : false
  );

  function loadQuiz(id: string) {
    try {
      const quizData = getQuizService(id);
      quiz.value = quizData;
      resetQuizState();
    } catch (err) {
      setError(err);
    }
  }

  function answerCurrentQuestion() {
    if (!currentQuestion.value) return;
    recordUserAnswer(currentQuestion.value, selectedOptionId.value);
    hasCheckedAnswer.value = true;
  }

  function goToNextQuestion() {
    if (!quiz.value) return;

    if (isLastQuestion.value) {
      finishQuiz();
      return;
    }

    incrementQuestionIndex();
    resetQuestionState();
  }

  function setError(err: unknown) {
    error.value.status = true;
    error.value.message = err instanceof Error ? err.message : "An unexpected error occurred";
  }

  function resetQuizState() {
    quizProgress.value = 0;
    currentQuestionIndex.value = 0;
    selectedOptionId.value = null;
    hasCheckedAnswer.value = false;
    isFinished.value = false;
    userHistory.value = [];
    userStats.value = { correct: 0, wrong: 0, percentage: 0, total: 0 };
  }

  function resetQuestionState() {
    selectedOptionId.value = null;
    hasCheckedAnswer.value = false;
  }

  function incrementQuestionIndex() {
    if (!quiz.value) return;
    currentQuestionIndex.value++;
    quizProgress.value =
      ((currentQuestionIndex.value + 1) / quiz.value.questions.length) * 100;
  }

  function recordUserAnswer(question: Quiz["questions"][number], selectedId: number | null) {
    const mappedAnswers = question.answers.map(answer => ({
      ...answer,
      isSelected: answer.id === selectedId
    }));

    userHistory.value.push({
      question: question.questionText,
      answers: mappedAnswers,
      explanation: question.correctAnswerExplanation,
      codeExample: question.correctAnswerCodeExample
    });
  }

  function finishQuiz() {
    isFinished.value = true;
    calculateUserStats();
  }

  function calculateUserStats() {
    const totalQuestions = userHistory.value.length;
    const correctAnswers = userHistory.value.filter(q => q.answers.every(ans => ans.isSelected === ans.isCorrect)).length;

    userStats.value.total = totalQuestions;
    userStats.value.correct = correctAnswers;
    userStats.value.wrong = totalQuestions - correctAnswers;
    userStats.value.percentage = Math.round((correctAnswers / totalQuestions) * 100);
  }

  return {
    error,
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
    quiz,

    loadQuiz,
    answerCurrentQuestion,
    goToNextQuestion
  };
}
