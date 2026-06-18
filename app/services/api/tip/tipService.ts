import type { TipService } from "@/services/api/tip/tip.interface";

function createTipService(): TipService {
  return {
    async fetchTips(locale, limit) {
      const collection = locale === "en" ? "tips_en" : "tips_es";

      let query = queryCollection(collection);

      if (limit) query = query.limit(limit);

      const data = await query.all();

      if (!data) {
        throw new Error("No data found");
      }

      return data;
    },
  };
}

export const tipService = createTipService();
