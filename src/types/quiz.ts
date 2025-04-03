export interface Quiz {
  id: string;
  isPublic: boolean;
  slug: string;
  level: "basic" | "intermediate" | "advanced";
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
    es: "Básico" | "Intermedio" | "Avanzado";
    en: "Basic" | "Intermediate" | "Advanced";
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
    en: CodeExample[];
    es: CodeExample[];
  };
  answers: Answer[];
}

export interface CodeExample {
  code: string;
  language: string;
}

export interface Answer {
  id: number;
  answerText: {
    en: string;
    es: string;
  };
  isCorrect: boolean;
}