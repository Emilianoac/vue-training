import { quizService } from "@@/server/services/quiz/quizService";

export default cachedEventHandler(async () => {
  return await quizService.fetchQuizzes();
},{
  maxAge: 30 * 60,
  staleMaxAge: 60 * 60 * 24,
})
