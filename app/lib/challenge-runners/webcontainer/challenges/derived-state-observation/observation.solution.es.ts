import {
  effect,
  resetCore,
  stop,
  track,
  trigger,
  type Cleanup,
  type ReactiveRef,
} from "./reactivity-core";

export type ComputedRef<T> = Readonly<ReactiveRef<T>>;
export type WatchSource<T> = ReactiveRef<T> | (() => T);
export type WatchCallback<T> = (
  newValue: T,
  oldValue: T | undefined,
  onCleanup: (cleanup: Cleanup) => void,
) => void;

export function computed<T>(getter: () => T): ComputedRef<T> {
  let cachedValue: T;
  let dirty = true;

  const computedRef: ComputedRef<T> = {
    get value() {
      track(computedRef, "value");

      if (dirty) {
        cachedValue = runner();
        dirty = false;
      }

      return cachedValue;
    },
  };

  const runner = effect(getter, {
    lazy: true,
    scheduler() {
      if (dirty) return;
      dirty = true;
      trigger(computedRef, "value");
    },
  });

  return computedRef;
}

export function watch<T>(
  source: WatchSource<T>,
  callback: WatchCallback<T>,
  options: { immediate?: boolean } = {},
): Cleanup {
  const getter = typeof source === "function" ? source : () => source.value;
  let oldValue: T | undefined;
  let cleanup: Cleanup | undefined;
  let initialized = false;

  function onCleanup(nextCleanup: Cleanup) {
    cleanup = nextCleanup;
  }

  const job = () => {
    const newValue = runner();
    if (initialized && Object.is(newValue, oldValue)) return;

    cleanup?.();
    cleanup = undefined;
    callback(newValue, initialized ? oldValue : undefined, onCleanup);
    oldValue = newValue;
    initialized = true;
  };

  const runner = effect(getter, {
    lazy: true,
    scheduler: job,
  });

  if (options.immediate) {
    job();
  } else {
    oldValue = runner();
    initialized = true;
  }

  return () => {
    cleanup?.();
    cleanup = undefined;
    stop(runner);
  };
}

export function watchEffect(
  fn: (onCleanup: (cleanup: Cleanup) => void) => void,
): Cleanup {
  let cleanup: Cleanup | undefined;

  function onCleanup(nextCleanup: Cleanup) {
    cleanup = nextCleanup;
  }

  const runner = effect(() => {
    cleanup?.();
    cleanup = undefined;
    fn(onCleanup);
  });

  return () => {
    cleanup?.();
    cleanup = undefined;
    stop(runner);
  };
}

export function resetObservation() {
  resetCore();
}
