import { lessonService } from "@/services/api/lesson/lessonService";
import type { Lesson } from "@/schemas/lesson.schema";

export default function useLessonData() {
  const { locale } = useI18n();

  const lesson = ref<Lesson>();
  const lessons = ref<Lesson[]>([]);
  const isLoading = ref(false);
  const error = ref<{ status: boolean; message: string }>({
    status: false,
    message: "",
  });

  async function getLesson(id: string) {
    await loadAndSet(() => lessonService.fetchLesson(id, locale.value), lesson);
  }

  async function getLesons() {
    await loadAndSet(() => lessonService.fetchLessons(locale.value), lessons);
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
    lesson,
    lessons,
    isLoading,
    error,

    getLesson,
    getLesons,
  };
}
