import type { LearningPath } from "@/schemas/learningPath.schema";

export interface LearningPathService {
  fetchLearningPath(documentId: string, locale: string): Promise<LearningPath>;
}
