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
  const cachedProxy = reactiveCache.get(target);
  if (cachedProxy) return cachedProxy as T;

  const proxy = new Proxy(target, {
    get(object, key, receiver) {
      const value = Reflect.get(object, key, receiver);
      track(object, key);
      return isObject(value) ? reactive(value) : value;
    },
    set(object, key, value, receiver) {
      const previousValue = Reflect.get(object, key, receiver);
      const updated = Reflect.set(object, key, value, receiver);

      if (updated && !Object.is(previousValue, value)) {
        trigger(object, key);
      }

      return updated;
    },
  });

  reactiveCache.set(target, proxy);
  return proxy;
}

function toReactive<T>(value: T): T {
  return (isObject(value) ? reactive(value) : value) as T;
}

export function ref<T>(initialValue: T): ReactiveRef<T> {
  let rawValue = initialValue;
  let currentValue = toReactive(initialValue);

  const reference: ReactiveRef<T> = {
    get value() {
      track(reference, "value");
      return currentValue;
    },
    set value(nextValue) {
      if (Object.is(rawValue, nextValue)) return;

      rawValue = nextValue;
      currentValue = toReactive(nextValue);
      trigger(reference, "value");
    },
  };

  return reference;
}

export function readonly<T extends object>(target: T): Readonly<T> {
  const cachedProxy = readonlyCache.get(target);
  if (cachedProxy) return cachedProxy as Readonly<T>;

  const proxy = new Proxy(target, {
    get(object, key, receiver) {
      const value = Reflect.get(object, key, receiver);
      return isObject(value) ? readonly(value) : value;
    },
    set() {
      return true;
    },
  });

  readonlyCache.set(target, proxy);
  return proxy;
}

export function toRef<T extends object, K extends keyof T>(
  object: T,
  key: K,
  defaultValue?: T[K],
): ReactiveRef<T[K]> {
  return {
    get value() {
      const value = object[key];
      return value === undefined ? (defaultValue as T[K]) : value;
    },
    set value(nextValue) {
      object[key] = nextValue;
    },
  };
}

export function toRefs<T extends object>(
  object: T,
): { [K in keyof T]: ReactiveRef<T[K]> } {
  const result: Record<PropertyKey, ReactiveRef<unknown>> = Array.isArray(object) ? [] : {};

  (Object.keys(object) as Array<keyof T>).forEach((key) => {
    result[key] = toRef(object, key) as ReactiveRef<unknown>;
  });

  return result as { [K in keyof T]: ReactiveRef<T[K]> };
}

export function resetReactivity() {
  activeEffect = undefined;
  targetMap = new WeakMap();
  reactiveCache = new WeakMap();
  readonlyCache = new WeakMap();
}
