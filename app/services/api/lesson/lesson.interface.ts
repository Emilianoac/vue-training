import type { Lesson } from "@/schemas/lesson.schema";

export interface LessonService {
  fetchLesson(id: string, locale: string): Promise<Lesson>;
  fetchLessons(locale: string): Promise<Lesson[]>;
}
