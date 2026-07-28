import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import { ref } from "vue";
// @ts-expect-error Virtual file mounted by the challenge runner.
import App from "./App.vue";
// @ts-expect-error Virtual file mounted by the challenge runner.
import ThemeStatus from "./ThemeStatus.vue";

describe("ThemeStatus.vue", () => {
  it("uses the fallback value when no provider exists", () => {
    const wrapper = mount(ThemeStatus);
    expect(wrapper.get('[data-testid="theme-status"]').text()).toContain("light");
  });

  it("renders the theme provided by an ancestor", () => {
    const wrapper = mount(ThemeStatus, { global: { provide: { theme: ref("dark") } } });
    expect(wrapper.get('[data-testid="theme-status"]').text()).toContain("dark");
  });
});

describe("App.vue", () => {
  it("keeps the theme reactive between provider and descendant", async () => {
    const wrapper = mount(App);
    expect(wrapper.get('[data-testid="theme-status"]').text()).toContain("light");
    await wrapper.get('[data-testid="toggle-theme"]').trigger("click");
    expect(wrapper.get('[data-testid="theme-status"]').text()).toContain("dark");
  });
});
