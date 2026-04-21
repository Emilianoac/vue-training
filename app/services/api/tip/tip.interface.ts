import type { Tip } from "~/schemas/tip.schema";

export interface TipService {
  fetchTips(locale: string): Promise<Tip[]>;
}
