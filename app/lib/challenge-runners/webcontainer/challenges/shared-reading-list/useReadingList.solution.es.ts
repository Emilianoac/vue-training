import { readonly, ref } from "vue";

const savedLessons = ref<string[]>([]);

export function useReadingList() {
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
