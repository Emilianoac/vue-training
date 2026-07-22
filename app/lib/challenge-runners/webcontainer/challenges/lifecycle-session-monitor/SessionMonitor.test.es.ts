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

  it("usa los hooks de ciclo de vida para iniciar y limpiar la sesion", () => {
    expect(source).toContain("onMounted");
    expect(source).toContain("onUnmounted");
    expect(source).toMatch(/onMounted\s*\(/);
    expect(source).toMatch(/onUnmounted\s*\(/);
  });

  it("activa la sesion cuando el componente se monta", async () => {
    const wrapper = mount(SessionMonitor);
    await nextTick();

    expect(wrapper.get('[data-testid="status"]').attributes("data-active")).toBe("true");
  });

  it("obtiene el ancho inicial al montar el componente", async () => {
    const wrapper = mount(SessionMonitor);
    await nextTick();

    expect(wrapper.get('[data-testid="viewport-width"]').text()).toBe(`${window.innerWidth}px`);
  });

  it("actualiza el tiempo activo cada segundo", async () => {
    vi.useFakeTimers();
    const wrapper = mount(SessionMonitor);

    vi.advanceTimersByTime(3000);
    await nextTick();

    expect(wrapper.get('[data-testid="seconds-online"]').text()).toBe("3s");
  });

  it("actualiza el ancho cuando cambia el tamano de la ventana", async () => {
    const wrapper = mount(SessionMonitor);

    Object.defineProperty(window, "innerWidth", {
      configurable: true,
      value: 900,
    });
    window.dispatchEvent(new Event("resize"));
    await nextTick();

    expect(wrapper.get('[data-testid="viewport-width"]').text()).toBe("900px");
  });

  it("limpia el intervalo y el listener cuando el componente se desmonta", () => {
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
