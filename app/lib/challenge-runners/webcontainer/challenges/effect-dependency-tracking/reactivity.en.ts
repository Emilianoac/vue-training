type Effect = () => void;

let activeEffect: Effect | undefined;
let targetMap = new WeakMap<object, Map<PropertyKey, Set<Effect>>>();

export function effect(fn: Effect) {
  // TODO: create a runner that marks itself as active while `fn` runs.
}

export function track(target: object, key: PropertyKey) {
  // TODO: connect the active effect to the target and key.
}

export function trigger(target: object, key: PropertyKey) {
  // TODO: re-run the effects connected to the target and key.
}

export function reactive<T extends object>(target: T): T {
  // TODO: return a Proxy that tracks reads and triggers writes.
  return target;
}

export function resetReactivity() {
  activeEffect = undefined;
  targetMap = new WeakMap();
}
