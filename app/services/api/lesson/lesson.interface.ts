import type { Lesson } from "@/schemas/lesson.schema";
import type { LessonsEnCollectionItem, LessonsEsCollectionItem } from "@nuxt/content";

export type LessonDocument = LessonsEnCollectionItem | LessonsEsCollectionItem;

export interface LessonService {
  fetchLesson(id: string, locale: string): Promise<LessonDocument>;
  fetchLessons(locale: string): Promise<Lesson[]>;
}
