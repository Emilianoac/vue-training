import { beforeEach, describe, expect, it, vi } from "vitest";
import { ref } from "vue";
import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import useDataListFilter from "@/composables/useDataListFilter";

const { translate } = vi.hoisted(() => ({
  translate: vi.fn((key: string) => key),
}));

mockNuxtImport("useI18n", () => {
  return () => ({ t: translate });
});

const items = [
  { id: "one", category: { name: "Reactivity" }, level: "basic" },
  { id: "two", category: { name: "Reactivity" }, level: "advanced" },
  { id: "three", category: { name: "Components" }, level: "basic" },
];

describe("useDataListFilter", () => {
  beforeEach(() => {
    translate.mockClear();
  });

  it("returns every item when no filters are selected", () => {
    const { currentDataList } = useDataListFilter(ref(items));

    expect(currentDataList.value).toEqual(items);
  });

  it("filters by category and difficulty", () => {
    const { category, difficulty, currentDataList } = useDataListFilter(ref(items));

    category.value = "Reactivity";
    difficulty.value = "advanced";

    expect(currentDataList.value.map((item) => item.id)).toEqual(["two"]);
  });

  it("creates unique category and difficulty options", () => {
    const { categories, difficulties } = useDataListFilter(ref(items));

    expect(categories.value).toEqual([
      { id: "all", label: "general.all" },
      { id: "Reactivity", label: "Reactivity" },
      { id: "Components", label: "Components" },
    ]);
    expect(difficulties.value).toEqual([
      { id: "all", label: "general.all" },
      { id: "basic", label: "general.levels.basic" },
      { id: "advanced", label: "general.levels.advanced" },
    ]);
  });

  it("reacts when the source list changes", () => {
    const source = ref(items);
    const { categories, currentDataList } = useDataListFilter(source);

    source.value = [
      ...items,
      { id: "four", category: { name: "Routing" }, level: "intermediate" },
    ];

    expect(categories.value.at(-1)).toEqual({ id: "Routing", label: "Routing" });
    expect(currentDataList.value).toHaveLength(4);
  });
});
