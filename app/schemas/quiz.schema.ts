import { z } from "zod";

export const codeExampleSchema = z.object({
  code: z.string(),
  language: z.string()
})

export const answerSchema = z.object({
  id: z.string(),
  isCorrect: z.boolean(),
  answerText: z.string()
})

export const questionSchema = z.object({
  questionText: z.string(),
  correctAnswerExplanation: z.string(),
  correctAnswerCodeExample: z.array(codeExampleSchema),
  answers: z.array(answerSchema)
})

export const categorySchema = z.object({
  name: z.string(),
  image: z.object({
    url: z.string()
  })
})

export const levelSchema = z.enum(["basic", "intermediate", "advanced"])

export const quizSchema = z.object({
  documentId: z.string(),
  title: z.string(),
  level: levelSchema,
  slug: z.string(),
  description: z.string(),
  category: categorySchema,
  questions: z.array(questionSchema)
})

export type Quiz = z.infer<typeof quizSchema>
export type QuizListItem = Pick<Quiz, "documentId" | "title" | "slug" | "level" | "description" | "category">
export type Level = z.infer<typeof levelSchema>
export type Question = z.infer<typeof questionSchema>