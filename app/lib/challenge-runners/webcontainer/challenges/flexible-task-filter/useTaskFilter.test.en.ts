import { ref } from "vue";
import { describe, expect, it } from "vitest";
import source from "./useTaskFilter.ts?raw";
import { useTaskFilter, type Task } from "./useTaskFilter";

const tasks: Task[] = [
  { id: 1, title: "Review documentation" },
  { id: 2, title: "Fix mobile navigation" },
  { id: 3, title: "Prepare release" },
];

describe("useTaskFilter", () => {
  it("normalizes inputs through toValue", () => {
    expect(source).toMatch(/\btoValue\s*\(/);
  });

  it("accepts plain values", () => {
    const { filteredTasks } = useTaskFilter(tasks, "documentation");

    expect(filteredTasks.value).toEqual([tasks[0]]);
  });

  it("reacts to ref changes", () => {
    const query = ref("mobile");
    const { filteredTasks } = useTaskFilter(tasks, query);

    expect(filteredTasks.value).toEqual([tasks[1]]);

    query.value = "release";

    expect(filteredTasks.value).toEqual([tasks[2]]);
  });

  it("tracks an input provided through a getter", () => {
    const term = ref("navigation");
    const { filteredTasks } = useTaskFilter(tasks, () => term.value);

    expect(filteredTasks.value).toEqual([tasks[1]]);

    term.value = "review";

    expect(filteredTasks.value).toEqual([tasks[0]]);
  });

  it("reacts when the task collection changes", () => {
    const taskSource = ref<Task[]>(tasks);
    const { filteredTasks } = useTaskFilter(taskSource, "vue");

    expect(filteredTasks.value).toEqual([]);

    taskSource.value = [...tasks, { id: 4, title: "Upgrade Vue" }];

    expect(filteredTasks.value).toEqual([{ id: 4, title: "Upgrade Vue" }]);
  });

  it("ignores whitespace and letter casing", () => {
    const { filteredTasks } = useTaskFilter(tasks, "  REVIEW  ");

    expect(filteredTasks.value).toEqual([tasks[0]]);
  });

  it("returns every task when the query is empty", () => {
    const { filteredTasks } = useTaskFilter(tasks, "   ");

    expect(filteredTasks.value).toEqual(tasks);
  });
});
