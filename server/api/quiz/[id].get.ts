import { quizService } from "@@/server/services/quiz/quizService";

export default cachedEventHandler(async (event) => {

  const slug = getRouterParam(event, "id");
  const locale = getQuery(event).locale?.toString() ?? "en";

  if (!slug) {
    throw createError({
      statusCode: 400,
      statusMessage: "Quiz slug is required",
    });
  }

  try {
    return await quizService.fetchQuiz(slug, locale);
  } catch(e) {
    throw createError({
      statusCode: 404,
      statusMessage: "Quiz not found."
    });
  }
},{
  maxAge: 30 * 60,
  staleMaxAge: 60 * 60 * 24,
})
