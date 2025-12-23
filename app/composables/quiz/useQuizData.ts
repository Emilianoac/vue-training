import { quizService } from "@/services/api/quiz/quizService";
import type { Quiz } from "@/types/quiz";

export default function useQuizData() {
  const { locale } = useI18n();
  
  const quiz = ref<Quiz>();
  const quizzes = ref<Quiz[]>([]);
  const isLoading = ref(false);
  const error = ref<{ status: boolean; message: string }>({ 
    status: false, 
    message: "" 
  });

  async function getQuiz(slug: string) {
    await loadAndSet(() => quizService.fetchQuiz(`/api/quiz/${slug}?locale=${locale.value}`), quiz)
  }

  async function getQuizzes() {
    await loadAndSet(() => quizService.fetchQuizzes(`/api/quiz/all?locale=${locale.value}`), quizzes)
  }

  async function loadAndSet<T>(fetchFn: () => Promise<T>, targetRef: Ref<T>) {
    isLoading.value = true;
    error.value.status = false;
    error.value.message = "";

    try {
      const data = await fetchFn();
      targetRef.value = data;
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