import { mount } from "@vue/test-utils";
import { afterEach, describe, expect, it, vi } from "vitest";
// @ts-expect-error Archivo virtual montado por el challenge runner.
import App from "./App.vue";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("useKeyboardShortcut", () => {
  it("responde solamente a Ctrl + Alt + M", async () => {
    const wrapper = mount(App);

    window.dispatchEvent(new KeyboardEvent("keydown", { ctrlKey: true, key: "m" }));
    await wrapper.vm.$nextTick();
    expect(wrapper.find('[data-testid="shortcut-panel"]').exists()).toBe(true);

    window.dispatchEvent(new KeyboardEvent("keydown", { altKey: true, ctrlKey: true, key: "m" }));
    await wrapper.vm.$nextTick();
    expect(wrapper.find('[data-testid="shortcut-panel"]').exists()).toBe(false);

    wrapper.unmount();
  });

  it("elimina al desmontar el mismo listener que registró", () => {
    const addListener = vi.spyOn(window, "addEventListener");
    const removeListener = vi.spyOn(window, "removeEventListener");
    const wrapper = mount(App);
    const registration = addListener.mock.calls.find(([eventName]) => eventName === "keydown");
    const handler = registration?.[1];

    wrapper.unmount();

    expect(handler).toBeTypeOf("function");
    expect(removeListener).toHaveBeenCalledWith("keydown", handler);
  });
});
