import { challengeService } from "@@/server/services/challenge/challengeService";

export default defineEventHandler(async (event) => {
  const locale = getQuery(event).locale?.toString() ?? "en";

  try {
    return await challengeService.fetchChallenges(locale);
  } catch(e) {
    throw createError({
      statusCode: 404,
      statusMessage: "Challenges not found."
    });
  }
})