import { beforeEach, describe, expect, it, vi } from "vitest";
import { effect, ref } from "../../../app/lib/challenge-runners/webcontainer/challenges/derived-state-observation/reactivity-core";
import {
  computed,
  resetObservation,
  watch,
  watchEffect,
} from "../../../app/lib/challenge-runners/webcontainer/challenges/derived-state-observation/observation.solution.en";

describe("derived state observation challenge solution", () => {
  beforeEach(resetObservation);

  it("keeps computed lazy, cached, and observable", () => {
    const source = ref(1);
    const getter = vi.fn(() => source.value * 2);
    const doubled = computed(getter);
    const render = vi.fn(() => doubled.value);

    expect(getter).not.toHaveBeenCalled();
    effect(render);
    expect(doubled.value).toBe(2);
    expect(getter).toHaveBeenCalledTimes(1);

    source.value = 2;
    expect(render).toHaveBeenCalledTimes(2);
    expect(doubled.value).toBe(4);
    expect(getter).toHaveBeenCalledTimes(2);
  });

  it("watches explicit changes and supports immediate undefined values", () => {
    const source = ref<string | undefined>(undefined);
    const callback = vi.fn();

    watch(source, callback, { immediate: true });
    source.value = "ready";

    expect(callback.mock.calls.map((call) => call.slice(0, 2))).toEqual([
      [undefined, undefined],
      ["ready", undefined],
    ]);
  });

  it("cleans up watch and watchEffect before reruns and stop", () => {
    const source = ref(0);
    const watchCleanup = vi.fn();
    const effectCleanup = vi.fn();
    const stopWatch = watch(source, (_value, _oldValue, onCleanup) => onCleanup(watchCleanup));
    const stopEffect = watchEffect((onCleanup) => {
      void source.value;
      onCleanup(effectCleanup);
    });

    source.value = 1;
    source.value = 2;
    stopWatch();
    stopEffect();

    expect(watchCleanup).toHaveBeenCalledTimes(2);
    expect(effectCleanup).toHaveBeenCalledTimes(3);
  });
});
