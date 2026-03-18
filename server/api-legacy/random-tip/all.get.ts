import { randomTipService } from "@@/server/services/random-tip/randomTipService";

export default cachedEventHandler(async (event) => {
  const locale = getQuery(event).locale?.toString() ?? "en";

  try {
    return await randomTipService.fetchRandomTips(locale);
  } catch(e) {
    throw createError({
      statusCode: 404,
      statusMessage: "Random Tips not found."
    });
  }
},{
  maxAge: 30 * 60,
  staleMaxAge: 60 * 60 * 24,
})