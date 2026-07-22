import { mount } from "@vue/test-utils";
import { afterEach, describe, expect, it, vi } from "vitest";
import { nextTick } from "vue";
import source from "./SessionMonitor.vue?raw";
// @ts-expect-error Virtual file mounted by the challenge runner. Example: src/Component.vue.
import SessionMonitor from "./SessionMonitor.vue";

describe("SessionMonitor.vue", () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("uses lifecycle hooks to start and clean up the session", () => {
    expect(source).toContain("onMounted");
    expect(source).toContain("onUnmounted");
    expect(source).toMatch(/onMounted\s*\(/);
    expect(source).toMatch(/onUnmounted\s*\(/);
  });

  it("activates the session when the component mounts", async () => {
    const wrapper = mount(SessionMonitor);
    await nextTick();

    expect(wrapper.get('[data-testid="status"]').attributes("data-active")).toBe("true");
  });

  it("gets the initial viewport width when the component mounts", async () => {
    const wrapper = mount(SessionMonitor);
    await nextTick();

    expect(wrapper.get('[data-testid="viewport-width"]').text()).toBe(`${window.innerWidth}px`);
  });

  it("updates the active time every second", async () => {
    vi.useFakeTimers();
    const wrapper = mount(SessionMonitor);

    vi.advanceTimersByTime(3000);
    await nextTick();

    expect(wrapper.get('[data-testid="seconds-online"]').text()).toBe("3s");
  });

  it("updates the width when the window is resized", async () => {
    const wrapper = mount(SessionMonitor);

    Object.defineProperty(window, "innerWidth", {
      configurable: true,
      value: 900,
    });
    window.dispatchEvent(new Event("resize"));
    await nextTick();

    expect(wrapper.get('[data-testid="viewport-width"]').text()).toBe("900px");
  });

  it("cleans up the interval and listener when the component unmounts", () => {
    vi.useFakeTimers();
    const clearIntervalSpy = vi.spyOn(window, "clearInterval");
    const removeEventListenerSpy = vi.spyOn(window, "removeEventListener");
    const wrapper = mount(SessionMonitor);

    wrapper.unmount();

    expect(clearIntervalSpy).toHaveBeenCalled();
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "resize",
      expect.any(Function),
    );
  });
});
