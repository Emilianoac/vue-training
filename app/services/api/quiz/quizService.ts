
import { dataFetcher } from "@/services/utils/dataFetcher";
import type { Quiz} from "@/types/quiz";

import type { QuizService} from "@/services/api/quiz/quizService.interface";

function createQuizService(): QuizService {
  return {
    async fetchQuiz(url) {
      return dataFetcher<Quiz>(url);
    },
    async fetchQuizzes(url) {
      return dataFetcher<Quiz[]>(url)
    }
  }
}

export const quizService = createQuizService();