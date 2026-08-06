import { computed, toValue, type MaybeRefOrGetter } from "vue";

export type Task = {
  id: number;
  title: string;
};

export function useTaskFilter(
  tasks: MaybeRefOrGetter<Task[]>,
  query: MaybeRefOrGetter<string>,
) {
  const filteredTasks = computed<Task[]>(() => {
    // TODO: read tasks and query with toValue.
    // Normalize the query with trim and toLowerCase.
    // If it is empty, return every task; otherwise, filter by title.
    return [];
  });

  return { filteredTasks };
}
