export interface Quiz {
  id: string;
  isPublic: boolean;
  slug: string;
  level: "easy" | "medium" | "hard";
  category: {
    id: string;
    name: string;
    image: string;
  };
  title: {
    en: string;
    es: string;
  };
  levelLabel: {
    en: "Easy" | "Medium" | "Hard";
    es: "Fácil" | "Medio" | "Difícil";
  };
  description: {
    en: string;
    es: string;
  };
  questions: Question[];
}

export interface Question {
  id: number;
  questionText: {
    en: string;
    es: string;
  };
  correctAnswerExplanation: {
    en: string;
    es: string;
  }
  correctAnswerCodeExample: {
    en: string;
    es: string;
  };
  codeLanguage: "javascript" | "typescript" | "handlebars" | "html" | "css";
  answers: Answer[];
}

export interface Answer {
  id: number;
  answerText: {
    en: string;
    es: string;
  };
  isCorrect: boolean;
}