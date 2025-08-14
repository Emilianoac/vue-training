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
  title: MultilingualString;
  levelLabel: {
    es: "Básico" | "Intermedio" | "Avanzado";
    en: "Basic" | "Intermediate" | "Advanced";
  };
  description: MultilingualString;
  questions: Question[];
}

export interface Question {
  id: number;
  questionText: MultilingualString;
  correctAnswerExplanation: MultilingualString;
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
  answerText: MultilingualString;
  isCorrect: boolean;
}

export interface AnswerRecord {
  question: MultilingualString;
  answers: Array<Answer & { isSelected: boolean }>;
  explanation: MultilingualString;
  codeExample: { en: CodeExample[]; es: CodeExample[] };
}

export interface MultilingualString {
  en: string;
  es: string;
}