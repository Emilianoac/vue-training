import { beforeEach, describe, expect, it, vi } from "vitest";
import { effect, reactive, resetReactivity } from "./reactivity";

describe("seguimiento de dependencias reactivas", () => {
  beforeEach(resetReactivity);

  it("ejecuta un efecto inmediatamente y después de cambiar una propiedad seguida", () => {
    const state = reactive({ count: 0 });
    const render = vi.fn(() => state.count);

    effect(render);
    state.count += 1;

    expect(render).toHaveBeenCalledTimes(2);
  });

  it("notifica solo a los efectos conectados con la propiedad modificada", () => {
    const state = reactive({ count: 0, name: "Ada" });
    const renderCount = vi.fn(() => state.count);
    const renderName = vi.fn(() => state.name);

    effect(renderCount);
    effect(renderName);
    state.count += 1;

    expect(renderCount).toHaveBeenCalledTimes(2);
    expect(renderName).toHaveBeenCalledTimes(1);
  });

  it("distingue la misma clave en objetos objetivo diferentes", () => {
    const first = reactive({ count: 0 });
    const second = reactive({ count: 0 });
    const renderFirst = vi.fn(() => first.count);
    const renderSecond = vi.fn(() => second.count);

    effect(renderFirst);
    effect(renderSecond);
    first.count += 1;

    expect(renderFirst).toHaveBeenCalledTimes(2);
    expect(renderSecond).toHaveBeenCalledTimes(1);
  });

  it("no conserva un efecto activo después de la ejecución", () => {
    const state = reactive({ count: 0, name: "Ada" });
    const render = vi.fn(() => state.count);

    effect(render);
    void state.name;
    state.name = "Grace";

    expect(render).toHaveBeenCalledTimes(1);
  });
});
