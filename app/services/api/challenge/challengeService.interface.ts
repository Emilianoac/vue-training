import type { Challenge, ChallengeListItem, } from "@/schemas/challenge.schema";

export interface ChallengeService {
  fetchChallenge(slug: string, locale: string): Promise<Challenge>;
  fetchChallenges(locale: string): Promise<ChallengeListItem[]>;
}