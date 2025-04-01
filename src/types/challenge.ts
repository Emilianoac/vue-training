export interface Challenge {
  id: string;
  cover: string;
  images: string[];
  level: "basic" | "intermediate" | "advanced";
  levelLabel: {
    en: "Basic" | "Intermediate" | "Advanced";
    es: "Básico" | "Intermedio" | "Avanzado";
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