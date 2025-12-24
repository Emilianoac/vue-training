import type { Challenge } from "@/types/challenge";

export interface ChallengeService {
  fetchChallenge(url: string): Promise<Challenge>;
  fetchChallenges(url: string): Promise<Challenge[]>;
}