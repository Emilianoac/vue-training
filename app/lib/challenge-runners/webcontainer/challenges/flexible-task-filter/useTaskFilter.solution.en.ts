import { computed, toValue, type MaybeRefOrGetter } from "vue";

export type Task = {
  id: number;
  title: string;
};

export function useTaskFilter(
  tasks: MaybeRefOrGetter<Task[]>,
  query: MaybeRefOrGetter<string>,
) {
  const filteredTasks = computed(() => {
    const currentTasks = toValue(tasks);
    const normalizedQuery = toValue(query).trim().toLowerCase();

    if (!normalizedQuery) return currentTasks;

    return currentTasks.filter((task) =>
      task.title.toLowerCase().includes(normalizedQuery),
    );
  });

  return { filteredTasks };
}
