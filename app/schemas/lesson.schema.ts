import { z } from "zod";

export const levelSchema = z.enum(["basic", "intermediate", "advanced"]);

export const LessonSchema = z.object({
  documentId: z.string(),
  title: z.string(),
  level: levelSchema,
  description: z.string().optional(),
});

export type Lesson = z.infer<typeof LessonSchema>;
