import {
  effect,
  resetCore,
  stop,
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
  // TODO: create a lazy effect, cache its result, and invalidate it with a scheduler.
  return {
    get value() {
      return getter();
    },
  };
}

export function watch<T>(
  source: WatchSource<T>,
  callback: WatchCallback<T>,
  options: { immediate?: boolean } = {},
): Cleanup {
  // TODO: observe the explicit source, preserve oldValue, and manage cleanup.
  void source;
  void callback;
  void options;
  return () => {};
}

export function watchEffect(
  fn: (onCleanup: (cleanup: Cleanup) => void) => void,
): Cleanup {
  // TODO: discover dependencies while running fn and clean up before repeats or stop.
  const runner = effect(() => fn(() => {}));
  return () => stop(runner);
}

export function resetObservation() {
  resetCore();
}
