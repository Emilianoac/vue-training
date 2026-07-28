import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import source from "./App.vue?raw";
// @ts-expect-error Archivo virtual montado por el challenge runner.
import App from "./App.vue";
// @ts-expect-error Archivo virtual montado por el challenge runner.
import SecurityTab from "./SecurityTab.vue";

describe("App.vue", () => {
  it("usa un componente dinámico dentro de KeepAlive", () => {
    expect(source).toContain("<component");
    expect(source).toContain(":is=");
    expect(source).toContain("<KeepAlive>");
  });

  it("alterna entre las pestañas", async () => {
    const wrapper = mount(App);
    expect(wrapper.get('[data-testid="profile-name"]').exists()).toBe(true);
    await wrapper.get('[data-testid="security-tab"]').trigger("click");
    expect(wrapper.get('[data-testid="two-factor"]').exists()).toBe(true);
  });

  it("conserva el estado al volver a una pestaña", async () => {
    const wrapper = mount(App);
    await wrapper.get('[data-testid="profile-name"]').setValue("Ana");
    await wrapper.get('[data-testid="security-tab"]').trigger("click");
    await wrapper.get('[data-testid="profile-tab"]').trigger("click");
    expect(wrapper.get<HTMLInputElement>('[data-testid="profile-name"]').element.value).toBe("Ana");
  });

  it("muestra los códigos de recuperación sin desmontar el panel", async () => {
    const wrapper = mount(SecurityTab);
    const recoveryCodes = wrapper.get<HTMLElement>('[data-testid="recovery-codes"]');

    expect(recoveryCodes.element.style.display).toBe("none");
    await wrapper.get('[data-testid="toggle-recovery"]').trigger("click");
    expect(recoveryCodes.element.style.display).not.toBe("none");
  });
});
