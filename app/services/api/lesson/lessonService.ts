import type { LessonService } from "./lesson.interface";

async function fetchLesson(id: string, locale: string) {
  const collection = locale === "en" ? "lessons_en" : "lessons_es";
  const data = await queryCollection(collection).where("documentId", "=", id).first();

  if (!data) throw new Error("Lesson not found");
  return data;
}

function createLessonService(): LessonService {
  return {
    fetchLesson,
    async fetchLessonForChallenge(challengeId, locale) {
      const learningPathsCollection = locale === "en" ? "learning_paths_en" : "learning_paths_es";
      const learningPaths = await queryCollection(learningPathsCollection).all();

      const relatedItems = learningPaths
        .flatMap((learningPath) => learningPath.steps)
        .flatMap((step) => step.sub_steps)
        .find((subStep) =>
          subStep.items.some((item) => item.type === "challenge" && item.id === challengeId),
        )?.items;
      const lessonId = relatedItems?.find((item) => item.type === "lesson")?.id;

      if (!lessonId) throw new Error("Related lesson not found");
      return fetchLesson(lessonId, locale);
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
