import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  createComponentInstance,
  emit,
  getCurrentInstance,
  inject,
  mountComponent,
  onMounted,
  onUnmounted,
  provide,
  resetRuntime,
  setupComponent,
  unmountComponent,
} from "../../../app/lib/challenge-runners/webcontainer/challenges/component-runtime/component-runtime.solution.en";

describe("component runtime challenge solution", () => {
  beforeEach(resetRuntime);

  it("prepares inputs, setup state, slots, and emitted events", () => {
    const onSave = vi.fn();
    const instance = createComponentInstance({
      type: {
        props: ["title"],
        emits: ["save"],
        setup: (props) => ({ heading: String(props.title).toUpperCase() }),
      },
      props: { title: "Runtime", id: "lab", onSave },
      children: { default: ({ suffix }) => `Content ${suffix}` },
    });

    setupComponent(instance);
    emit(instance, "save", 7);

    expect(instance.props).toEqual({ title: "Runtime" });
    expect(instance.attrs).toEqual({ id: "lab" });
    expect(instance.setupState).toEqual({ heading: "RUNTIME" });
    expect(instance.slots.default?.({ suffix: "ready" })).toEqual(["Content ready"]);
    expect(onSave).toHaveBeenCalledWith(7);
  });

  it("maintains active context and branch-based provides", () => {
    const root = createComponentInstance({
      type: { setup: () => void provide("theme", "light") },
    });
    setupComponent(root);

    const branch = createComponentInstance({
      type: { setup: () => void provide("theme", "dark") },
    }, root);
    setupComponent(branch);

    let theme: unknown;
    const child = createComponentInstance({
      type: {
        setup() {
          expect(getCurrentInstance()).not.toBeNull();
          theme = inject("theme");
        },
      },
    }, branch);
    setupComponent(child);

    expect(theme).toBe("dark");
    expect(root.provides.theme).toBe("light");
    expect(getCurrentInstance()).toBeNull();
  });

  it("renders and runs lifecycle hooks at mount and unmount", () => {
    const calls: string[] = [];
    const instance = createComponentInstance({
      type: {
        setup() {
          onMounted(() => calls.push("mounted"));
          onUnmounted(() => calls.push("unmounted"));
          return () => ({ type: "panel" });
        },
      },
    });

    setupComponent(instance);
    mountComponent(instance);
    unmountComponent(instance);

    expect(instance.subTree).toEqual({ type: "panel" });
    expect(instance.isMounted).toBe(true);
    expect(instance.isUnmounted).toBe(true);
    expect(calls).toEqual(["mounted", "unmounted"]);
  });
});
