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
    // TODO: lee tasks y query con toValue.
    // Normaliza la búsqueda con trim y toLowerCase.
    // Si está vacía, devuelve todas las tareas; si no, filtra por title.
    return [];
  });

  return { filteredTasks };
}
