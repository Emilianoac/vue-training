import { z } from "zod";

export const itemType = z.enum(["lesson", "challenge", "tip", "quiz"]);

export const itemSchema = z.object({
  type: itemType,
  id: z.string(),
  path: z.string(),
  title: z.string(),
  subtitle: z.string(),
});

export const stepSchema = z.object({
  name: z.string(),
  items: z.array(itemSchema),
});

export const learningPathSchema = z.object({
  documentId: z.string(),
  title: z.string(),
  steps: z.array(stepSchema),
});

export type LearningPath = z.infer<typeof learningPathSchema>;
export type Item = z.infer<typeof itemSchema>;
export type Step = z.infer<typeof stepSchema>;
export type ItemType = z.infer<typeof itemType>;
