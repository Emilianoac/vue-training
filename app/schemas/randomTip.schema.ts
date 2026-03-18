import { z } from "zod";

export const imageSchema = z.object({
  url: z.string()
})

export const categorySchema = z.object({
  name: z.string(),
  image: imageSchema
})


export const codeExampleSchema = z.object({
  code: z.string(),
  lang: z.string()
})

export const randomTipSchema = z.object({
  documentId: z.string(),
  title: z.string(),

  category: categorySchema,

  short_description: z.string(),

  content: z.string(), // markdown

  code_examples: z.array(codeExampleSchema).default([]),

  source_url: z.string().url().optional()
})

export type RandomTip = z.infer<typeof randomTipSchema>;
