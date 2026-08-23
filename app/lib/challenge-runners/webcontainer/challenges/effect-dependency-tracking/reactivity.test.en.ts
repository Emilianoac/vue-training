import { beforeEach, describe, expect, it, vi } from "vitest";
// @ts-expect-error Virtual file mounted by the challenge runner.
import { effect, reactive, resetReactivity } from "./reactivity";

describe("reactive dependency tracking", () => {
  beforeEach(resetReactivity);

  it("runs an effect immediately and after a tracked property changes", () => {
    const state = reactive({ count: 0 });
    const render = vi.fn(() => state.count);

    effect(render);
    state.count += 1;

    expect(render).toHaveBeenCalledTimes(2);
  });

  it("notifies only effects connected to the changed property", () => {
    const state = reactive({ count: 0, name: "Ada" });
    const renderCount = vi.fn(() => state.count);
    const renderName = vi.fn(() => state.name);

    effect(renderCount);
    effect(renderName);
    state.count += 1;

    expect(renderCount).toHaveBeenCalledTimes(2);
    expect(renderName).toHaveBeenCalledTimes(1);
  });

  it("distinguishes the same key on different target objects", () => {
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

  it("does not retain an active effect after execution", () => {
    const state = reactive({ count: 0, name: "Ada" });
    const render = vi.fn(() => state.count);

    effect(render);
    void state.name;
    state.name = "Grace";

    expect(render).toHaveBeenCalledTimes(1);
  });
});
