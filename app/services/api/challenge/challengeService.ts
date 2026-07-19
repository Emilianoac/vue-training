import type { ChallengeService } from "@/services/api/challenge/challengeService.interface";

function createChallengeService(): ChallengeService {
  return {
    async fetchChallenge(slug, locale) {
      const collection = locale === "en" ? "challenges_en" : "challenges_es";
      const data = await queryCollection(collection).where("slug", "=", slug).first();

      if (!data) throw new Error("Challenge not found");
      return data;
    },
    async fetchChallenges(locale, limit) {
      const collection = locale === "en" ? "challenges_en" : "challenges_es";

      let query = queryCollection(collection).select(
        "title",
        "slug",
        "level",
        "category",
        "short_description",
        "cover",
      );

      if (limit) query = query.limit(limit);

      const data = await query.all();

      if (!data) {
        throw new Error("No data found");
      }

      return data;
    },
  };
}

export const challengeService = createChallengeService();
