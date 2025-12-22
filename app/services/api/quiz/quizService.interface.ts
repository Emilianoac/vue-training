import type { Quiz} from "@/types/quiz";

export interface QuizService {
  fetchQuiz(url: string): Promise<Quiz>;
  fetchQuizzes(url: string): Promise<Quiz[]>;
}