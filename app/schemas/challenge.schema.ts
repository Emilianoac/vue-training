import { z } from "zod";

export const imageSchema = z.object({
  url: z.string(),
});

export const categorySchema = z.object({
  name: z.string(),
  image: imageSchema,
});

export const hintSchema = z.object({
  title: z.string(),
  body: z.string(),
});

export const levelSchema = z.enum(["basic", "intermediate", "advanced"]);

export const challengeSchema = z.object({
  documentId: z.string(),
  title: z.string(),
  slug: z.string(),
  level: levelSchema,

  category: categorySchema,

  short_description: z.string(),

  description: z.array(z.string()),

  instructions: z.array(z.string()),

  cover: imageSchema,

  images: z.array(imageSchema),

  hints: z.array(hintSchema),
});

export type Challenge = z.infer<typeof challengeSchema>;
export type ChallengeListItem = Pick<
  Challenge,
  "title" | "slug" | "level" | "category" | "short_description" | "cover"
>;
export type Level = z.infer<typeof levelSchema>;
