import type { LessonService } from "./lesson.interface";

function createLessonService(): LessonService {
  return {
    async fetchLesson(id, locale) {
      const collection = locale === "en" ? "lessons_en" : "lessons_es";
      const data = await queryCollection(collection).where("documentId", "=", id).first();

      if (!data) throw new Error("Lesson not found");
      return data;
    },
    async fetchLessons(locale) {
      const collection = locale === "en" ? "lessons_en" : "lessons_es";
      const data = await queryCollection(collection)
        .select("documentId", "title", "level", "description", "path")
        .all();

      if (!data) throw new Error("No lessons found");
      return data;
    },
  };
}

export const lessonService = createLessonService();
