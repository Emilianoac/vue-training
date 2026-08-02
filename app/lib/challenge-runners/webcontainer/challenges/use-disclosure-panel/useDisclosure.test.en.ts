import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import appSource from "./App.vue?raw";
// @ts-expect-error Virtual file mounted by the challenge runner.
import App from "./App.vue";
import { useDisclosure } from "./useDisclosure";

describe("useDisclosure", () => {
  it("respects the initial value", () => {
    expect(useDisclosure().isOpen.value).toBe(false);
    expect(useDisclosure(true).isOpen.value).toBe(true);
  });

  it("exposes actions to open, close, and toggle", () => {
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
  it("consumes the composable instead of keeping local state", () => {
    expect(appSource).toContain("useDisclosure(");
    expect(appSource).not.toContain("ref(");
  });

  it("controls the panel through the composable API", async () => {
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
