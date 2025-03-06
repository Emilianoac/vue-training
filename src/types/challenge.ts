export interface Challenge {
  id: string;
  cover: string;
  level: "easy" | "medium" | "hard";
  levelLabel: {
    en: "Easy" | "Medium" | "Hard";
    es: "Fácil" | "Medio" | "Difícil";
  };
  title: {
    en: string;
    es: string;
  };
  description: {
    en: string;
    es: string;
  };
  short_description: {
    en: string;
    es: string;
  };
  objectives: {
    en: string[];
    es: string[];
  };
  stackblitz: {
    challenge: string;
    solution: string;
  }
}