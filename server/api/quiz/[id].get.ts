import { quizService } from "@@/server/services/quiz/quizService";

export default cachedEventHandler(async (event) => {

  const slug = getRouterParam(event, "id");
  const locale = getCookie(event, "i18n_redirected") ?? "en";

  if (!slug) {
    throw createError({
      statusCode: 400,
      statusMessage: "Quiz slug is required",
    });
  }

  return await quizService.fetchQuiz(slug, locale);

},{
  maxAge: 30 * 60,
  staleMaxAge: 60 * 60 * 24,
})
