export interface Quiz {
  id: string;
  isPublic: boolean;
  slug: string;
  level: "basic" | "intermediate" | "advanced";
  category: {
    id: string;
    name: string;
    image: {
      url: string
    }
  };
  title: string
  description: string
  questions: Question[];
}

export interface Question {
  id: number;
  questionText: string
  correctAnswerExplanation: string
  correctAnswerCodeExample: CodeExample[];
  answers: Answer[];
}

export interface CodeExample {
  code: string;
  language: string;
}

export interface Answer {
  id: number;
  answerText: string
  isCorrect: boolean;
}

export interface AnswerRecord {
  question: string
  answers: Array<Answer & { isSelected: boolean }>;
  explanation: string
  codeExample: CodeExample[];
}

export interface MultilingualString {
  en: string;
  es: string;
}