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
  codeExample: CodeExample[];
}

export interface CodeExample {
  lang: string;
  code: {
    es: string;
    en: string;
  };
}