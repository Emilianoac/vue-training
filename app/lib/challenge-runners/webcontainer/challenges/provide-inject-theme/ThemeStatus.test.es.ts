import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import { ref } from "vue";
// @ts-expect-error Archivo virtual montado por el challenge runner.
import App from "./App.vue";
// @ts-expect-error Archivo virtual montado por el challenge runner.
import ThemeStatus from "./ThemeStatus.vue";

describe("ThemeStatus.vue", () => {
  it("usa el valor de respaldo cuando no existe un proveedor", () => {
    const wrapper = mount(ThemeStatus);
    expect(wrapper.get('[data-testid="theme-status"]').text()).toContain("light");
  });

  it("muestra el tema proporcionado por un ancestro", () => {
    const wrapper = mount(ThemeStatus, { global: { provide: { theme: ref("dark") } } });
    expect(wrapper.get('[data-testid="theme-status"]').text()).toContain("dark");
  });
});

describe("App.vue", () => {
  it("mantiene reactivo el tema entre proveedor y descendiente", async () => {
    const wrapper = mount(App);
    expect(wrapper.get('[data-testid="theme-status"]').text()).toContain("light");
    await wrapper.get('[data-testid="toggle-theme"]').trigger("click");
    expect(wrapper.get('[data-testid="theme-status"]').text()).toContain("dark");
  });
});
