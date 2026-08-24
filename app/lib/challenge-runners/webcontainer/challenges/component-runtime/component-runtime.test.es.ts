import { beforeEach, describe, expect, it, vi } from "vitest";
// @ts-expect-error Archivo virtual montado en /src/component-runtime.ts por el runner del challenge.
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
} from "./component-runtime";

describe("runtime de componentes", () => {
  beforeEach(resetRuntime);

  it("crea instancias independientes con relaciones parent y root", () => {
    const definition = {};
    const root = createComponentInstance({ type: definition });
    const child = createComponentInstance({ type: definition }, root);
    const sibling = createComponentInstance({ type: definition }, root);

    expect(root.root).toBe(root);
    expect(child.parent).toBe(root);
    expect(child.root).toBe(root);
    expect(child.uid).not.toBe(sibling.uid);
    expect(child.props).not.toBe(sibling.props);
  });

  it("clasifica props declaradas, attrs, listeners y slots", () => {
    const onSave = vi.fn();
    const instance = createComponentInstance({
      type: { props: ["title"], emits: ["save"] },
      props: { title: "Runtime", id: "lab", onSave },
      children: { default: ({ suffix }) => `Contenido ${suffix}` },
    });

    setupComponent(instance);

    expect(instance.props).toEqual({ title: "Runtime" });
    expect(instance.attrs).toEqual({ id: "lab" });
    expect(instance.slots.default?.({ suffix: "listo" })).toEqual(["Contenido listo"]);
  });

  it("ejecuta setup con una instancia activa y guarda bindings de objeto", () => {
    const observed = vi.fn();
    const instance = createComponentInstance({
      type: {
        props: ["count"],
        setup(props) {
          observed(getCurrentInstance(), props.count);
          return { doubled: Number(props.count) * 2 };
        },
      },
      props: { count: 3 },
    });

    setupComponent(instance);

    expect(observed).toHaveBeenCalledWith(instance, 3);
    expect(instance.setupState).toEqual({ doubled: 6 });
    expect(getCurrentInstance()).toBeNull();
  });

  it("usa una función retornada por setup como render", () => {
    const instance = createComponentInstance({
      type: { setup: () => () => ({ type: "output", value: 4 }) },
    });

    setupComponent(instance);
    mountComponent(instance);

    expect(instance.subTree).toEqual({ type: "output", value: 4 });
  });

  it("emite hacia el listener guardado en el VNode actual", () => {
    const onSave = vi.fn();
    const instance = createComponentInstance({
      type: { emits: ["save"] },
      props: { onSave },
    });

    emit(instance, "save", { id: 7 });
    expect(onSave).toHaveBeenCalledWith({ id: 7 });
  });

  it("hereda y oculta valores proporcionados por rama", () => {
    const root = createComponentInstance({
      type: { setup: () => void provide("theme", "light") },
    });
    setupComponent(root);

    let firstTheme: unknown;
    const firstChild = createComponentInstance({
      type: { setup: () => { firstTheme = inject("theme"); } },
    }, root);
    setupComponent(firstChild);

    const branch = createComponentInstance({
      type: { setup: () => void provide("theme", "dark") },
    }, root);
    setupComponent(branch);

    let branchTheme: unknown;
    const deepChild = createComponentInstance({
      type: { setup: () => { branchTheme = inject("theme"); } },
    }, branch);
    setupComponent(deepChild);

    expect(firstTheme).toBe("light");
    expect(branchTheme).toBe("dark");
    expect(root.provides.theme).toBe("light");
  });

  it("ejecuta hooks mounted y unmounted en sus límites", () => {
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
    expect(calls).toEqual([]);

    mountComponent(instance);
    expect(instance.isMounted).toBe(true);
    expect(calls).toEqual(["mounted"]);

    unmountComponent(instance);
    expect(instance.isUnmounted).toBe(true);
    expect(calls).toEqual(["mounted", "unmounted"]);
  });
});
