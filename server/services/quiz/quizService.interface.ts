import type { Quiz} from "@/types/quiz";

export interface QuizService {
  fetchQuiz(slug: string, locale: string): Promise<Quiz>;
  fetchQuizzes(locale: string): Promise<Quiz[]>;
}