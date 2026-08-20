type Effect = () => void;

let activeEffect: Effect | undefined;
let targetMap = new WeakMap<object, Map<PropertyKey, Set<Effect>>>();

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

export function track(target: object, key: PropertyKey) {
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

export function trigger(target: object, key: PropertyKey) {
  const effects = targetMap.get(target)?.get(key);
  if (!effects) return;

  new Set(effects).forEach((effect) => effect());
}

export function reactive<T extends object>(target: T): T {
  return new Proxy(target, {
    get(object, key) {
      track(object, key);
      return Reflect.get(object, key);
    },
    set(object, key, value) {
      const updated = Reflect.set(object, key, value);
      trigger(object, key);
      return updated;
    },
  });
}

export function resetReactivity() {
  activeEffect = undefined;
  targetMap = new WeakMap();
}
