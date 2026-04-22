import { z } from "zod";

export const imageSchema = z.object({
  url: z.string(),
});

export const categorySchema = z.object({
  name: z.string(),
  image: imageSchema,
});

export const tipSchema = z.object({
  id: z.string(),
  title: z.string(),
  category: categorySchema,
  short_description: z.string(),
  source_url: z.string().url().optional(),
});

export type Tip = z.infer<typeof tipSchema>;
