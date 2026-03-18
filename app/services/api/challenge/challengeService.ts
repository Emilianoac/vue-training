
import type { ChallengeService } from "@/services/api/challenge/challengeService.interface";

function createChallengeService(): ChallengeService {
  return {
    async fetchChallenge(slug, locale) {
      const collection = locale === "en" ? "challenges_en" : "challenges_es";
      const data = await queryCollection(collection)
      .where("slug", "=", slug)
      .first();

      if (!data) throw new Error("Challenge not found");
      return data;
    },
    async fetchChallenges(locale) {
      const collection = locale === "en" ? "challenges_en" : "challenges_es";
      const data = await queryCollection(collection)
      .select("title", "slug", "level", "category", "short_description", "cover" )
      .all();

      return data;
    }
  }
}

export const challengeService = createChallengeService();