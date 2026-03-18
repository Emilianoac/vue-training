import type { Quiz, QuizListItem } from "@/schemas/quiz.schema";
export interface QuizService {
  fetchQuiz(slug: string, locale: string): Promise<Quiz>;
  fetchQuizzes(locale: string): Promise<QuizListItem[]>;
}