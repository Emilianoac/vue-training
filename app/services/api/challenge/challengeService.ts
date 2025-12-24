
import { dataFetcher } from "@/services/utils/dataFetcher";
import type { Challenge } from "@/types/challenge";

import type { ChallengeService } from "@/services/api/challenge/challengeService.interface";

function createChallengeService(): ChallengeService {
  return {
    async fetchChallenge(url) {
      return dataFetcher<Challenge>(url);
    },
    async fetchChallenges(url) {
      return dataFetcher<Challenge[]>(url)
    }
  }
}

export const challengeService = createChallengeService();