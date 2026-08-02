import { readonly, ref } from "vue";

export function useReadingList() {
  // TODO: move this state to module scope so consumers share it.
  const savedLessons = ref<string[]>([]);

  function saveLesson(lessonId: string) {
    if (!savedLessons.value.includes(lessonId)) {
      savedLessons.value.push(lessonId);
    }
  }

  function removeLesson(lessonId: string) {
    savedLessons.value = savedLessons.value.filter((id) => id !== lessonId);
  }

  function reset() {
    savedLessons.value = [];
  }

  return {
    savedLessons: readonly(savedLessons),
    saveLesson,
    removeLesson,
    reset,
  };
}
