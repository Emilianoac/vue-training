import type { ItemType } from "@/schemas/learningPath.schema";

const STORAGE_KEY = "learning-path-progress";

type CompletedSet = Record<string, boolean>;

function storageKey(pathId: string, type: ItemType, id: string) {
  return `${pathId}:${type}:${id}`;
}

function readStorage(): CompletedSet {
  if (import.meta.server) return {};
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");
  } catch {
    return {};
  }
}

function writeStorage(data: CompletedSet) {
  if (import.meta.server) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function useLearningPathProgress() {
  const completed = useState<CompletedSet>("lp-progress", () => readStorage());

  function isCompleted(pathId: string, type: ItemType, id: string) {
    return computed(() => !!completed.value[storageKey(pathId, type, id)]);
  }

  function markComplete(pathId: string, type: ItemType, id: string) {
    const key = storageKey(pathId, type, id);
    completed.value = { ...completed.value, [key]: true };
    writeStorage(completed.value);
  }

  function markIncomplete(pathId: string, type: ItemType, id: string) {
    const key = storageKey(pathId, type, id);
    const next = { ...completed.value };
    delete next[key];
    completed.value = next;
    writeStorage(next);
  }

  return { isCompleted, markComplete, markIncomplete };
}
