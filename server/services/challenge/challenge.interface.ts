
import type {Challenge} from "@/types/challenge"

export interface ChallengeService {
  fetchChallenge(slug: string, locale: string): Promise<Challenge>
  fetchChallenges(locale: string): Promise<Challenge[]>
}