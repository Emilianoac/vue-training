import type { RandomTip } from "@/schemas/randomTip.schema";

export interface RandomTipService {
  fetchRandomTips(locale: string): Promise<RandomTip[]>;
}