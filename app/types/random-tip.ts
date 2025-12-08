export interface RandomTip {
  id: number;
  mood: "happy" | "angry" | "surprised";
  category: {
    id: string;
    name: string;
    icon: string;
  },
  description: {
    es: string
    en: string;
  },
  title: {
    es: string
    en: string;
  }
  text: {
    es: string
    en: string;
  }
  codeExamples: CodeExamples[];
  source?: string;
}

export interface CodeExamples {
  lang: string;
  code: {
    es: string;
    en: string;
  };
}