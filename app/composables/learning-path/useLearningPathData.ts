import type { LearningPath } from "@/schemas/learningPath.schema";
import { learningPathService } from "@/services/api/learning-path/learningPathService";

export default function useLearningPathData() {
  const { locale } = useI18n();

  const learningPath = ref<LearningPath | null>(null);
  const isLoading = ref(false);
  const error = ref<{ status: boolean; message: string }>({
    status: false,
    message: "",
  });

  async function getLearningPath(slug: string) {
    await loadAndSet(() => learningPathService.fetchLearningPath(slug, locale.value), learningPath);
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
      error.value.message = err instanceof Error ? err.message : "Unkown error";
    } finally {
      isLoading.value = false;
    }
  }

  return {
    learningPath,
    isLoading,
    error,

    getLearningPath,
  };
}
