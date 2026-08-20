import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  effect,
  reactive,
  resetReactivity,
} from "../../../app/lib/challenge-runners/webcontainer/challenges/effect-dependency-tracking/reactivity.solution.en";

describe("effect dependency tracking challenge solution", () => {
  beforeEach(resetReactivity);

  it("notifies only the effect connected to the changed property", () => {
    const state = reactive({ count: 0, name: "Ada" });
    const renderCount = vi.fn(() => state.count);
    const renderName = vi.fn(() => state.name);

    effect(renderCount);
    effect(renderName);
    state.count += 1;

    expect(renderCount).toHaveBeenCalledTimes(2);
    expect(renderName).toHaveBeenCalledTimes(1);
  });

  it("keeps equal property keys on different targets independent", () => {
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
});
