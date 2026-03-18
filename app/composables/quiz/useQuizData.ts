import { quizService } from "@/services/api/quiz/quizService";
import type { Quiz, QuizListItem } from "@/schemas/quiz.schema";

export default function useQuizData() {
  const { locale } = useI18n();
  
  const quiz = ref<Quiz>();
  const quizzes = ref<QuizListItem[]>([]);
  const isLoading = ref(false);
  const error = ref<{ status: boolean; message: string }>({ 
    status: false, 
    message: "" 
  });

  async function getQuiz(slug: string) {
    await loadAndSet(
      `quiz-${slug}-${locale.value}`, 
      () => quizService.fetchQuiz(slug, locale.value), 
      quiz
    );
  }

  async function getQuizzes() {
    await loadAndSet(
      `quizzes-${locale.value}`,
      () => quizService.fetchQuizzes(locale.value), 
      quizzes
    );
  }

  async function loadAndSet<T>(key: string, fetchFn: () => Promise<T>, targetRef: Ref<T>) {
    isLoading.value = true;
    error.value.status = false;
    error.value.message = "";

    try {
      const { data, error: fetchError } = await useAsyncData(key ,fetchFn);

      if (fetchError.value) throw fetchError.value;

      targetRef.value = data.value as T;
    } catch (err) {
      error.value.status = true;
      error.value.message = err instanceof Error ? err.message : "Unkown error"
    } finally {
      isLoading.value = false;
    }
  }

  return {
    quiz,
    quizzes,
    isLoading,
    error,

    getQuiz,
    getQuizzes
  };
}