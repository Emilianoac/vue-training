export type Cleanup = () => void;
export type ReactiveRef<T> = { value: T };

type ReactiveEffect = {
  active: boolean;
  dependencies: Set<ReactiveEffect>[];
  fn: () => unknown;
  runner: EffectRunner;
  scheduler?: () => void;
};

export type EffectRunner<T = unknown> = (() => T) & {
  effect: ReactiveEffect;
};

type EffectOptions = {
  lazy?: boolean;
  scheduler?: () => void;
};

let activeEffect: ReactiveEffect | undefined;
const effectStack: ReactiveEffect[] = [];
let targetMap = new WeakMap<object, Map<PropertyKey, Set<ReactiveEffect>>>();

function cleanupEffect(effect: ReactiveEffect) {
  effect.dependencies.forEach((dependency) => dependency.delete(effect));
  effect.dependencies.length = 0;
}

export function effect<T>(fn: () => T, options: EffectOptions = {}): EffectRunner<T> {
  const reactiveEffect = {
    active: true,
    dependencies: [],
    fn,
    runner: undefined as unknown as EffectRunner<T>,
    scheduler: options.scheduler,
  };

  const runner = (() => {
    if (!reactiveEffect.active) return fn();

    cleanupEffect(reactiveEffect);
    effectStack.push(reactiveEffect);
    activeEffect = reactiveEffect;

    try {
      return fn();
    } finally {
      effectStack.pop();
      activeEffect = effectStack.at(-1);
    }
  }) as EffectRunner<T>;

  reactiveEffect.runner = runner;
  runner.effect = reactiveEffect;

  if (!options.lazy) runner();
  return runner;
}

export function track(target: object, key: PropertyKey) {
  if (!activeEffect) return;

  let dependenciesMap = targetMap.get(target);
  if (!dependenciesMap) {
    dependenciesMap = new Map();
    targetMap.set(target, dependenciesMap);
  }

  let dependency = dependenciesMap.get(key);
  if (!dependency) {
    dependency = new Set();
    dependenciesMap.set(key, dependency);
  }

  if (dependency.has(activeEffect)) return;
  dependency.add(activeEffect);
  activeEffect.dependencies.push(dependency);
}

export function trigger(target: object, key: PropertyKey) {
  const effects = targetMap.get(target)?.get(key);
  if (!effects) return;

  new Set(effects).forEach((reactiveEffect) => {
    if (reactiveEffect === activeEffect) return;

    if (reactiveEffect.scheduler) {
      reactiveEffect.scheduler();
    } else {
      reactiveEffect.runner();
    }
  });
}

export function stop(runner: EffectRunner) {
  const reactiveEffect = runner.effect;
  if (!reactiveEffect.active) return;

  cleanupEffect(reactiveEffect);
  reactiveEffect.active = false;
}

export function ref<T>(initialValue: T): ReactiveRef<T> {
  let currentValue = initialValue;

  const reference: ReactiveRef<T> = {
    get value() {
      track(reference, "value");
      return currentValue;
    },
    set value(nextValue) {
      if (Object.is(currentValue, nextValue)) return;
      currentValue = nextValue;
      trigger(reference, "value");
    },
  };

  return reference;
}

export function resetCore() {
  activeEffect = undefined;
  effectStack.length = 0;
  targetMap = new WeakMap();
}
