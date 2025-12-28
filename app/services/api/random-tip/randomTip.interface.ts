import type { RandomTip } from "@/types/random-tip";

export interface RandomTipService {
  fetchRandomTips(url: string): Promise<RandomTip[]>;
}