
import { dataFetcher } from "@/services/utils/dataFetcher";
import type { RandomTip } from "@/types/random-tip";

import type { RandomTipService } from "@/services/api/random-tip/randomTip.interface";

function createRandomTipService(): RandomTipService {
  return {
    async fetchRandomTips(url) {
      return dataFetcher<RandomTip[]>(url)
    }
  }
}

export const randomTipService = createRandomTipService();