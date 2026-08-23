type Effect = () => void;
export type ReactiveRef<T> = { value: T };

let activeEffect: Effect | undefined;
let targetMap = new WeakMap<object, Map<PropertyKey, Set<Effect>>>();
let reactiveCache = new WeakMap<object, object>();
let readonlyCache = new WeakMap<object, object>();

function isObject(value: unknown): value is object {
  return value !== null && typeof value === "object";
}

export function effect(fn: Effect) {
  const runner = () => {
    activeEffect = runner;

    try {
      fn();
    } finally {
      activeEffect = undefined;
    }
  };

  runner();
  return runner;
}

function track(target: object, key: PropertyKey) {
  if (!activeEffect) return;

  let dependenciesMap = targetMap.get(target);
  if (!dependenciesMap) {
    dependenciesMap = new Map();
    targetMap.set(target, dependenciesMap);
  }

  let effects = dependenciesMap.get(key);
  if (!effects) {
    effects = new Set();
    dependenciesMap.set(key, effects);
  }

  effects.add(activeEffect);
}

function trigger(target: object, key: PropertyKey) {
  const effects = targetMap.get(target)?.get(key);
  if (!effects) return;
  new Set(effects).forEach((effect) => effect());
}

export function reactive<T extends object>(target: T): T {
  // TODO: create and cache a Proxy with lazy nested conversion.
  // Track reads and trigger only writes that change the value.
  return target;
}

export function ref<T>(initialValue: T): ReactiveRef<T> {
  // TODO: use a reactive getter and setter for the `value` property.
  return { value: initialValue };
}

export function readonly<T extends object>(target: T): Readonly<T> {
  // TODO: create a deep Proxy view that blocks writes through it.
  return target;
}

export function toRef<T extends object, K extends keyof T>(
  object: T,
  key: K,
  defaultValue?: T[K],
): ReactiveRef<T[K]> {
  // TODO: link `value` with `object[key]` without copying the property.
  return { value: object[key] ?? (defaultValue as T[K]) };
}

export function toRefs<T extends object>(
  object: T,
): { [K in keyof T]: ReactiveRef<T[K]> } {
  // TODO: create a toRef for every existing enumerable property.
  return {} as { [K in keyof T]: ReactiveRef<T[K]> };
}

export function resetReactivity() {
  activeEffect = undefined;
  targetMap = new WeakMap();
  reactiveCache = new WeakMap();
  readonlyCache = new WeakMap();
}
