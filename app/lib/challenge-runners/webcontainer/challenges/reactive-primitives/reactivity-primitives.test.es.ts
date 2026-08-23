import { beforeEach, describe, expect, it, vi } from "vitest";
// @ts-expect-error Archivo virtual montado por el runner del challenge.
import {
  effect,
  reactive,
  readonly,
  ref,
  resetReactivity,
  toRef,
  toRefs,
} from "./reactivity-primitives";

describe("primitivas reactivas", () => {
  beforeEach(resetReactivity);

  it("reactive notifica solo cuando una propiedad cambia", () => {
    const state = reactive({ count: 0 });
    const render = vi.fn(() => state.count);

    effect(render);
    state.count = 1;
    state.count = 1;

    expect(render).toHaveBeenCalledTimes(2);
  });

  it("reactive convierte objetos anidados y conserva la identidad del proxy", () => {
    const state = reactive({ profile: { name: "Ada" } });
    const render = vi.fn(() => state.profile.name);

    expect(state.profile).toBe(state.profile);
    effect(render);
    state.profile.name = "Grace";

    expect(render).toHaveBeenCalledTimes(2);
  });

  it("ref sigue value y omite asignaciones repetidas", () => {
    const count = ref(0);
    const render = vi.fn(() => count.value);

    effect(render);
    count.value = 1;
    count.value = 1;

    expect(render).toHaveBeenCalledTimes(2);
  });

  it("ref convierte los objetos asignados en estado reactivo", () => {
    const profile = ref({ name: "Ada" });
    const render = vi.fn(() => profile.value.name);

    effect(render);
    profile.value.name = "Grace";

    expect(render).toHaveBeenCalledTimes(2);
  });

  it("readonly conserva una vista viva y bloquea escrituras profundas", () => {
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

  it("toRef enlaza lecturas y escrituras con la propiedad original", () => {
    const state = reactive({ count: 0 });
    const count = toRef(state, "count");

    count.value = 2;
    expect(state.count).toBe(2);

    state.count = 3;
    expect(count.value).toBe(3);
  });

  it("toRef usa un valor predeterminado sin romper el enlace", () => {
    const state: { label?: string } = reactive({});
    const label = toRef(state, "label", "Sin nombre");

    expect(label.value).toBe("Sin nombre");
    label.value = "Total";
    expect(state.label).toBe("Total");
  });

  it("toRefs enlaza las claves actuales y conserva la forma de los arrays", () => {
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
