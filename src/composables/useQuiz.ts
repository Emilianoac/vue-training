import {ref, computed} from "vue";
import type {Quiz, Answer, CodeExample} from "@/types/quiz";

export default function useQuiz(quiz: Quiz | null) {  
  if (!quiz) throw new Error("No quiz provided");

  const quizInit = ref(false);
  const quizProgress = ref(0);
  const currentQuestionIndex = ref(0);
  const currentQuestion = computed(() => quiz.questions[currentQuestionIndex.value]);
  const selectedOption = ref<null | number>(null);
  const checkAnswer = ref(false);
  const isLastQuestion = computed(() => currentQuestionIndex.value === quiz.questions.length - 1);
  const isFinished = ref(false);

  const userHistory = ref<Array<{ 
    question: { en: string; es: string;}; 
    answers: Array<Answer & { isSelected: boolean; }>;
    explanation: { en: string; es: string; };
    codeExample: { en: CodeExample[]; es: CodeExample[]; };
  }>>([]);
  const userStats = ref({ correct: 0, wrong: 0, percentage: 0, total: 0 });

  function handleUserAnswer() {
    if (!quiz || !selectedOption.value || !currentQuestion.value) return;

    const answersWithSelection = currentQuestion.value.answers.map((answer: Answer) => ({
      id: answer.id,
      answerText: answer.answerText,
      isCorrect: answer.isCorrect,
      isSelected: answer.id === selectedOption.value,
    }));
    
    userHistory.value.push({
      question: currentQuestion.value.questionText,
      answers: answersWithSelection,
      explanation: currentQuestion.value.correctAnswerExplanation,
      codeExample: currentQuestion.value.correctAnswerCodeExample,
    });

    checkAnswer.value = true;
  };

  function handleNextQuestion() {
    if (!quiz) return;

    if (currentQuestionIndex.value === quiz.questions.length - 1) {
      isFinished.value = true;

      userStats.value.total = userHistory.value.length;
      userStats.value.correct = userHistory.value.filter((question) => {
        return question.answers.every((answer) => answer.isSelected === answer.isCorrect);
      }).length;
      userStats.value.wrong = userStats.value.total - userStats.value.correct;
      userStats.value.percentage = Math.round((userStats.value.correct / userStats.value.total) * 100);
      return;
    }

    currentQuestionIndex.value++;
    quizProgress.value = ((currentQuestionIndex.value + 1) / quiz.questions.length) * 100;
    checkAnswer.value = false;
    selectedOption.value = null;
  }

  return {
    quizInit,
    quizProgress,
    currentQuestionIndex,
    currentQuestion,
    selectedOption,
    checkAnswer,
    userStats,
    userHistory,
    isLastQuestion,
    isFinished,

    handleUserAnswer,
    handleNextQuestion
  }
}