import { beforeEach, describe, expect, it, vi } from "vitest";
// @ts-expect-error Virtual file mounted by the challenge runner.
import {
  effect,
  reactive,
  readonly,
  ref,
  resetReactivity,
  toRef,
  toRefs,
} from "./reactivity-primitives";

describe("reactive primitives", () => {
  beforeEach(resetReactivity);

  it("reactive notifies only when a property changes", () => {
    const state = reactive({ count: 0 });
    const render = vi.fn(() => state.count);

    effect(render);
    state.count = 1;
    state.count = 1;

    expect(render).toHaveBeenCalledTimes(2);
  });

  it("reactive converts nested objects and preserves proxy identity", () => {
    const state = reactive({ profile: { name: "Ada" } });
    const render = vi.fn(() => state.profile.name);

    expect(state.profile).toBe(state.profile);
    effect(render);
    state.profile.name = "Grace";

    expect(render).toHaveBeenCalledTimes(2);
  });

  it("ref tracks value and skips repeated assignments", () => {
    const count = ref(0);
    const render = vi.fn(() => count.value);

    effect(render);
    count.value = 1;
    count.value = 1;

    expect(render).toHaveBeenCalledTimes(2);
  });

  it("ref converts assigned objects into reactive state", () => {
    const profile = ref({ name: "Ada" });
    const render = vi.fn(() => profile.value.name);

    effect(render);
    profile.value.name = "Grace";

    expect(render).toHaveBeenCalledTimes(2);
  });

  it("readonly keeps a live view and blocks deep writes", () => {
    const state = reactive({ count: 0, nested: { enabled: true } });
    const view = readonly(state);
    const render = vi.fn(() => view.count);

    effect(render);
    state.count = 1;
    (view as { count: number }).count = 2;
    view.nested.enabled = false;

    expect(render).toHaveBeenCalledTimes(2);
    expect(state.count).toBe(1);
    expect(state.nested.enabled).toBe(true);
  });

  it("toRef links reads and writes with the original property", () => {
    const state = reactive({ count: 0 });
    const count = toRef(state, "count");

    count.value = 2;
    expect(state.count).toBe(2);

    state.count = 3;
    expect(count.value).toBe(3);
  });

  it("toRef uses a default value without breaking the link", () => {
    const state: { label?: string } = reactive({});
    const label = toRef(state, "label", "Untitled");

    expect(label.value).toBe("Untitled");
    label.value = "Total";
    expect(state.label).toBe("Total");
  });

  it("toRefs links current keys and preserves array shape", () => {
    const state: { count: number; label?: string } = reactive({ count: 0 });
    const links = toRefs(state);
    const list = toRefs(reactive(["a", "b"]));

    state.label = "Total";

    expect(links.count.value).toBe(0);
    expect("label" in links).toBe(false);
    expect(Array.isArray(list)).toBe(true);
    expect(list[1].value).toBe("b");
  });
});
