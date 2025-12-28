export interface RandomTip {
  documentId: string;
  title: string;
  category: {
    id: string;
    name: string;
    image: {
      url: string
    }
  },
  short_description: string;
  content: string
  code_examples: CodeExamples[];
  source_url?: string;
}

export interface CodeExamples {
  lang: string;
  code: string;
}