import { quizService } from "@@/server/services/quiz/quizService";

export default cachedEventHandler(async (event) => {
  const locale = getQuery(event).locale?.toString() ?? "en";

  try {
    return await quizService.fetchQuizzes(locale);
  } catch(e) {
    throw createError({
      statusCode: 404,
      statusMessage: "Quizzes not found."
    });
  }
},{
  maxAge: 30 * 60,
  staleMaxAge: 60 * 60 * 24,
})