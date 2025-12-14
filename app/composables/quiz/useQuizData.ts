import { quizService } from "@/services/api/quiz/quizService";
import type { Quiz } from "@/types/quiz";

export default function useProjectData() {
  const quizzes = ref<Quiz[]>([]);
  const isLoading = ref(false);
  const error = ref<{ status: boolean; message: string }>({ 
    status: false, 
    message: "" 
  });

  async function getQuizzes() {
    await loadAndSet(() => quizService.fetchQuizzes(), quizzes)
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
    quizzes,
    isLoading,
    error,

    getQuizzes
  };
}