import type { TipService } from "@/services/api/tip/tip.interface";

function createTipService(): TipService {
  return {
    async fetchTips(locale) {
      const colection = locale === "en" ? "tips_en" : "tips_es";
      const data = await queryCollection(colection).all();

      if (!data) {
        throw new Error("No data found");
      }

      return data;
    },
  };
}

export const tipService = createTipService();
