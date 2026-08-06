import { ref } from "vue";
import { describe, expect, it } from "vitest";
import source from "./useTaskFilter.ts?raw";
import { useTaskFilter, type Task } from "./useTaskFilter";

const tasks: Task[] = [
  { id: 1, title: "Revisar documentación" },
  { id: 2, title: "Corregir navegación móvil" },
  { id: 3, title: "Preparar release" },
];

describe("useTaskFilter", () => {
  it("normaliza las entradas mediante toValue", () => {
    expect(source).toMatch(/\btoValue\s*\(/);
  });

  it("acepta valores directos", () => {
    const { filteredTasks } = useTaskFilter(tasks, "documentación");

    expect(filteredTasks.value).toEqual([tasks[0]]);
  });

  it("reacciona a cambios de un ref", () => {
    const query = ref("móvil");
    const { filteredTasks } = useTaskFilter(tasks, query);

    expect(filteredTasks.value).toEqual([tasks[1]]);

    query.value = "release";

    expect(filteredTasks.value).toEqual([tasks[2]]);
  });

  it("rastrea una entrada entregada mediante un getter", () => {
    const term = ref("navegación");
    const { filteredTasks } = useTaskFilter(tasks, () => term.value);

    expect(filteredTasks.value).toEqual([tasks[1]]);

    term.value = "revisar";

    expect(filteredTasks.value).toEqual([tasks[0]]);
  });

  it("reacciona cuando cambia la colección de tareas", () => {
    const taskSource = ref<Task[]>(tasks);
    const { filteredTasks } = useTaskFilter(taskSource, "vue");

    expect(filteredTasks.value).toEqual([]);

    taskSource.value = [...tasks, { id: 4, title: "Actualizar Vue" }];

    expect(filteredTasks.value).toEqual([{ id: 4, title: "Actualizar Vue" }]);
  });

  it("ignora espacios y diferencias entre mayúsculas y minúsculas", () => {
    const { filteredTasks } = useTaskFilter(tasks, "  REVISAR  ");

    expect(filteredTasks.value).toEqual([tasks[0]]);
  });

  it("devuelve todas las tareas cuando la búsqueda está vacía", () => {
    const { filteredTasks } = useTaskFilter(tasks, "   ");

    expect(filteredTasks.value).toEqual(tasks);
  });
});
