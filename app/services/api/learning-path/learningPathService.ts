import type { LearningPathService } from "./learningPathService.interface";

function ceateLearningPathService(): LearningPathService {
  return {
    async fetchLearningPath(documentId, locale) {
      const collection = locale === "en" ? "learning_paths_en" : "learning_paths_es";

      const path = await queryCollection(collection).where("documentId", "=", documentId).first();
      if (!path) throw new Error("Learning Path not found");

      return path;
    },
  };
}

export const learningPathService = ceateLearningPathService();
