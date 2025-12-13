
import { dataFetcher } from "@/services/utils/dataFetcher";
import type { Quiz} from "@/types/quiz";

import type { QuizService} from "@/services/api/quiz/quizService.interface";

function createQuizService(): QuizService {
  return {
    async fetchQuiz(slug: string) {
      return dataFetcher<Quiz>(`/api/quiz/${slug}`);
    },
    async fetchQuizzes() {
      return dataFetcher<Quiz[]>("/api/quiz/all")
    }
  }
}

export const quizService = createQuizService();