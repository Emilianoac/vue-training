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
  // TODO: crea un efecto lazy, cachea su resultado e invalídalo con un scheduler.
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
  // TODO: observa la fuente explícita, conserva oldValue y gestiona cleanup.
  void source;
  void callback;
  void options;
  return () => {};
}

export function watchEffect(
  fn: (onCleanup: (cleanup: Cleanup) => void) => void,
): Cleanup {
  // TODO: descubre dependencias al ejecutar fn y limpia antes de repetir o detener.
  const runner = effect(() => fn(() => {}));
  return () => stop(runner);
}

export function resetObservation() {
  resetCore();
}
