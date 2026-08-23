import { beforeEach, describe, expect, it, vi } from "vitest";
import { effect, ref } from "./reactivity-core";
// @ts-expect-error Archivo virtual montado por el runner del challenge.
import {
  computed,
  resetObservation,
  watch,
  watchEffect,
} from "./observation";

describe("estado derivado y observación", () => {
  beforeEach(resetObservation);

  it("computed es lazy y reutiliza su caché", () => {
    const count = ref(2);
    const getter = vi.fn(() => count.value * 2);
    const doubled = computed(getter);

    expect(getter).not.toHaveBeenCalled();
    expect(doubled.value).toBe(4);
    expect(doubled.value).toBe(4);
    expect(getter).toHaveBeenCalledTimes(1);
  });

  it("computed invalida la caché y notifica a sus consumidores", () => {
    const count = ref(1);
    const getter = vi.fn(() => count.value * 2);
    const doubled = computed(getter);
    const render = vi.fn(() => doubled.value);

    effect(render);
    count.value = 2;

    expect(render).toHaveBeenCalledTimes(2);
    expect(getter).toHaveBeenCalledTimes(2);
    expect(doubled.value).toBe(4);
    expect(getter).toHaveBeenCalledTimes(2);
  });

  it("watch entrega los valores nuevo y anterior de una fuente explícita", () => {
    const count = ref(0);
    const callback = vi.fn();

    watch(count, callback);
    count.value = 1;

    expect(callback).toHaveBeenCalledOnce();
    expect(callback.mock.calls[0]?.slice(0, 2)).toEqual([1, 0]);
  });

  it("watch immediate ejecuta el callback aunque el valor inicial sea undefined", () => {
    const value = ref<string | undefined>(undefined);
    const callback = vi.fn();

    watch(value, callback, { immediate: true });

    expect(callback).toHaveBeenCalledOnce();
    expect(callback.mock.calls[0]?.slice(0, 2)).toEqual([undefined, undefined]);
  });

  it("watch no recopila lecturas realizadas dentro de su callback", () => {
    const source = ref(0);
    const unrelated = ref(0);
    const callback = vi.fn(() => unrelated.value);

    watch(source, callback);
    source.value = 1;
    unrelated.value = 1;

    expect(callback).toHaveBeenCalledOnce();
  });

  it("watch limpia antes del siguiente callback y al detenerse", () => {
    const source = ref(0);
    const cleanup = vi.fn();
    const stopWatch = watch(source, (_value, _oldValue, onCleanup) => {
      onCleanup(cleanup);
    });

    source.value = 1;
    source.value = 2;
    expect(cleanup).toHaveBeenCalledTimes(1);

    stopWatch();
    expect(cleanup).toHaveBeenCalledTimes(2);
  });

  it("watchEffect se ejecuta inmediatamente y descubre sus dependencias", () => {
    const count = ref(0);
    const callback = vi.fn(() => count.value);

    watchEffect(callback);
    count.value = 1;

    expect(callback).toHaveBeenCalledTimes(2);
  });

  it("watchEffect limpia antes de repetirse y cuando se detiene", () => {
    const count = ref(0);
    const cleanup = vi.fn();
    const stopEffect = watchEffect((onCleanup) => {
      void count.value;
      onCleanup(cleanup);
    });

    count.value = 1;
    expect(cleanup).toHaveBeenCalledTimes(1);

    stopEffect();
    expect(cleanup).toHaveBeenCalledTimes(2);
  });
});
