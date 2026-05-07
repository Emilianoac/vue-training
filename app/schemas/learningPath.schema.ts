import { z } from "zod";

export const itemLevel = z.enum(["basic", "intermediate", "advanced"]);
export const itemType = z.enum(["lesson", "challenge", "tip", "quiz"]);

export const itemSchema = z.object({
  type: itemType,
  level: itemLevel,
  id: z.string(),
  title: z.string(),
  subtitle: z.string(),
});

export const subStepSchema = z.object({
  name: z.string(),
  id: z.string(),
  items: z.array(itemSchema),
});

export const stepSchema = z.object({
  name: z.string(),
  sub_steps: z.array(subStepSchema),
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
