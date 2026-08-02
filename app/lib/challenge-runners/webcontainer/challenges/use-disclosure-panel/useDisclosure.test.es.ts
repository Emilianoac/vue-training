import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import appSource from "./App.vue?raw";
// @ts-expect-error Archivo virtual montado por el challenge runner.
import App from "./App.vue";
import { useDisclosure } from "./useDisclosure";

describe("useDisclosure", () => {
  it("respeta el valor inicial", () => {
    expect(useDisclosure().isOpen.value).toBe(false);
    expect(useDisclosure(true).isOpen.value).toBe(true);
  });

  it("expone acciones para abrir, cerrar y alternar", () => {
    const { isOpen, open, close, toggle } = useDisclosure();

    open();
    expect(isOpen.value).toBe(true);
    toggle();
    expect(isOpen.value).toBe(false);
    open();
    close();
    expect(isOpen.value).toBe(false);
  });
});

describe("App.vue", () => {
  it("consume el composable en lugar de mantener estado local", () => {
    expect(appSource).toContain("useDisclosure(");
    expect(appSource).not.toContain("ref(");
  });

  it("controla el panel mediante la API del composable", async () => {
    const wrapper = mount(App);
    const panel = wrapper.get<HTMLElement>('[data-testid="details-panel"]');

    expect(panel.element.style.display).toBe("none");
    await wrapper.get('[data-testid="open-button"]').trigger("click");
    expect(panel.element.style.display).not.toBe("none");
    await wrapper.get('[data-testid="close-button"]').trigger("click");
    expect(panel.element.style.display).toBe("none");
    await wrapper.get('[data-testid="toggle-button"]').trigger("click");
    expect(panel.element.style.display).not.toBe("none");
  });
});
