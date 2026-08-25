import type { ItemType } from "@/schemas/learningPath.schema";

const LEARNING_PATH_ROUTE = "/learn/learning-paths";
const SECTION_STORAGE_KEY_PREFIX = "vue-training:learning-path:return-section:";
const typeToSegment: Record<ItemType, string> = {
  lesson: "lessons",
  quiz: "quizzes",
  challenge: "challenges",
  tip: "tips",
};

export function createActivityPath(pathId: string, type: ItemType, activityId: string) {
  return `/learn/learning-path/${pathId}/${typeToSegment[type]}/${activityId}`;
}

export function rememberLearningPathSection(pathId: string, sectionId: string) {
  if (typeof sessionStorage === "undefined" || !isValidSectionId(sectionId)) return;

  sessionStorage.setItem(createSectionStorageKey(pathId), sectionId);
}

export function consumeLearningPathSection(pathId: string) {
  if (typeof sessionStorage === "undefined") return null;

  const storageKey = createSectionStorageKey(pathId);
  const sectionId = sessionStorage.getItem(storageKey);
  sessionStorage.removeItem(storageKey);
  return isValidSectionId(sectionId) ? sectionId : null;
}

export function forgetLearningPathSection(pathId: string) {
  if (typeof sessionStorage === "undefined") return;
  sessionStorage.removeItem(createSectionStorageKey(pathId));
}

export function getLearningPathReturnPath() {
  return LEARNING_PATH_ROUTE;
}

function createSectionStorageKey(pathId: string) {
  return `${SECTION_STORAGE_KEY_PREFIX}${pathId}`;
}

function isValidSectionId(sectionId: unknown): sectionId is string {
  return typeof sectionId === "string" && /^[a-z0-9-]+$/i.test(sectionId);
}
