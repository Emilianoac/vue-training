
import type { RandomTipService } from "@/services/api/random-tip/randomTip.interface";

function createRandomTipService(): RandomTipService {
  return {
    async fetchRandomTips(locale) {
      const colection = locale === "en" ? "randomTips_en" : "randomTips_es";
      const data  = await queryCollection(colection).all();

      if (!data) {
        throw new Error("No data found");
      }

      return data;
    }
  }
}

export const randomTipService = createRandomTipService();