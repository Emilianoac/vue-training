import { mount } from "@vue/test-utils";
import { beforeEach, describe, expect, it } from "vitest";
import { isReadonly } from "vue";
// @ts-expect-error Virtual file mounted by the challenge runner.
import App from "./App.vue";
import { useReadingList } from "./useReadingList";

beforeEach(() => {
  useReadingList().reset();
});

describe("useReadingList", () => {
  it("shares state across consumers", () => {
    const catalog = useReadingList();
    const sidebar = useReadingList();

    catalog.saveLesson("reactivity");
    expect(sidebar.savedLessons.value).toEqual(["reactivity"]);
  });

  it("exposes readonly state and controls its mutations", () => {
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
  it("synchronizes the catalog with the reading list", async () => {
    const wrapper = mount(App);

    expect(wrapper.findAll('[data-testid="saved-lesson"]')).toHaveLength(0);
    await wrapper.findAll('[data-testid="save-lesson"]')[0]?.trigger("click");
    expect(wrapper.findAll('[data-testid="saved-lesson"]')).toHaveLength(1);
    expect(wrapper.get('[data-testid="saved-lesson"]').text()).toContain("Reactivity principles");
  });
});
