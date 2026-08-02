import { mount } from "@vue/test-utils";
import { beforeEach, describe, expect, it } from "vitest";
import { isReadonly } from "vue";
// @ts-expect-error Archivo virtual montado por el challenge runner.
import App from "./App.vue";
import { useReadingList } from "./useReadingList";

beforeEach(() => {
  useReadingList().reset();
});

describe("useReadingList", () => {
  it("comparte el estado entre consumidores", () => {
    const catalog = useReadingList();
    const sidebar = useReadingList();

    catalog.saveLesson("reactivity");
    expect(sidebar.savedLessons.value).toEqual(["reactivity"]);
  });

  it("expone el estado como readonly y controla sus mutaciones", () => {
    const { savedLessons, saveLesson, removeLesson } = useReadingList();

    expect(isReadonly(savedLessons)).toBe(true);
    saveLesson("computed");
    saveLesson("computed");
    expect(savedLessons.value).toEqual(["computed"]);
    removeLesson("computed");
    expect(savedLessons.value).toEqual([]);
  });
});

describe("App.vue", () => {
  it("sincroniza el catálogo con la lista de lectura", async () => {
    const wrapper = mount(App);

    expect(wrapper.findAll('[data-testid="saved-lesson"]')).toHaveLength(0);
    await wrapper.findAll('[data-testid="save-lesson"]')[0]?.trigger("click");
    expect(wrapper.findAll('[data-testid="saved-lesson"]')).toHaveLength(1);
    expect(wrapper.get('[data-testid="saved-lesson"]').text()).toContain(
      "Principios de reactividad",
    );
  });
});
