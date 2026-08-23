import { beforeEach, describe, expect, it, vi } from "vitest";
import { effect, ref } from "./reactivity-core";
// @ts-expect-error Virtual file mounted by the challenge runner.
import {
  computed,
  resetObservation,
  watch,
  watchEffect,
} from "./observation";

describe("derived state and observation", () => {
  beforeEach(resetObservation);

  it("computed is lazy and reuses its cache", () => {
    const count = ref(2);
    const getter = vi.fn(() => count.value * 2);
    const doubled = computed(getter);

    expect(getter).not.toHaveBeenCalled();
    expect(doubled.value).toBe(4);
    expect(doubled.value).toBe(4);
    expect(getter).toHaveBeenCalledTimes(1);
  });

  it("computed invalidates its cache and notifies consumers", () => {
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

  it("watch provides new and previous values from an explicit source", () => {
    const count = ref(0);
    const callback = vi.fn();

    watch(count, callback);
    count.value = 1;

    expect(callback).toHaveBeenCalledOnce();
    expect(callback.mock.calls[0]?.slice(0, 2)).toEqual([1, 0]);
  });

  it("immediate watch runs even when the initial value is undefined", () => {
    const value = ref<string | undefined>(undefined);
    const callback = vi.fn();

    watch(value, callback, { immediate: true });

    expect(callback).toHaveBeenCalledOnce();
    expect(callback.mock.calls[0]?.slice(0, 2)).toEqual([undefined, undefined]);
  });

  it("watch does not track reads made inside its callback", () => {
    const source = ref(0);
    const unrelated = ref(0);
    const callback = vi.fn(() => unrelated.value);

    watch(source, callback);
    source.value = 1;
    unrelated.value = 1;

    expect(callback).toHaveBeenCalledOnce();
  });

  it("watch cleans up before the next callback and when stopped", () => {
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

  it("watchEffect runs immediately and discovers its dependencies", () => {
    const count = ref(0);
    const callback = vi.fn(() => count.value);

    watchEffect(callback);
    count.value = 1;

    expect(callback).toHaveBeenCalledTimes(2);
  });

  it("watchEffect cleans up before repeating and when stopped", () => {
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
