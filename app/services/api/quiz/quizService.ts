
import type { QuizService} from "@/services/api/quiz/quizService.interface";

function createQuizService(): QuizService {
  return {
    async fetchQuiz(slug, locale ) {
      const collection = locale === "en" ? "quizzes_en" : "quizzes_es";
      const data = await queryCollection(collection)
      .where("slug", "=", slug)
      .first();


      if (!data) throw new Error("Quiz not found");
      return data;
    },
    async fetchQuizzes(locale) {
      const collection = locale === "en" ? "quizzes_en" : "quizzes_es";
      const data = await queryCollection(collection)
      .select("documentId", "title", "slug", "level", "description", "category")
      .all();


      if (!data) throw new Error("No quizzes found");
      return data;
    }
  }
}

export const quizService = createQuizService();