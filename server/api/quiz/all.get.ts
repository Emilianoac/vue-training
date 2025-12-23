import { quizService } from "@@/server/services/quiz/quizService";

export default cachedEventHandler(async (event) => {
  const locale = getQuery(event).locale?.toString() ?? "en";

  return await quizService.fetchQuizzes(locale);
},{
  maxAge: 30 * 60,
  staleMaxAge: 60 * 60 * 24,
})