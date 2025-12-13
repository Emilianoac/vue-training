import { quizService } from "@@/server/services/quiz/quizService";

export default defineEventHandler(async () => {
  return await quizService.fetchQuizzes();
})
