import { challengeService } from "@@/server/services/challenge/challengeService";

export default cachedEventHandler(async (event) => {

  const slug = getRouterParam(event, "id");
  const locale = getQuery(event).locale?.toString() ?? "en";

  if (!slug) {
    throw createError({
      statusCode: 400,
      statusMessage: "Challenge slug is required",
    });
  }

  try {
    return await challengeService.fetchChallenge(slug, locale);
  } catch(e) {
    throw createError({
      statusCode: 404,
      statusMessage: "Challenge not found."
    });
  }
},{
  maxAge: 30 * 60,
  staleMaxAge: 60 * 60 * 24,
})
