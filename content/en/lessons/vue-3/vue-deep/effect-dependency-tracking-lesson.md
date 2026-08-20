---
documentId: effect-dependency-tracking-lesson
title: Effects and Dependency Tracking
level: basic
description: Understand how Vue connects reactive reads with the work that needs to update.
---

## What is a reactive effect?

When reactive state changes, Vue needs to know which work depends on it. A component render, a `computed`, and a watcher all use reactive effects internally.

A reactive effect is a function whose dependencies are collected while it runs. If one of those dependencies changes, the effect can run again.

```js
let total;

effect(() => {
  total = state.price * state.quantity;
});
```

In this example, the effect reads `price` and `quantity`. Both properties become its dependencies.

This lesson uses reduced pedagogical implementations. They explain the model while omitting optimizations and internal edge cases from Vue's production implementation.

---

## Track reads and trigger changes

The system performs two fundamental operations:

- `track(target, key)` records that the active effect read a property.
- `trigger(target, key)` finds the associated effects when that property changes.

Vue 3 can call these operations automatically because `reactive()` wraps objects with a `Proxy`:

```js
function reactive(target) {
  return new Proxy(target, {
    get(object, key) {
      track(object, key);
      return object[key];
    },
    set(object, key, value) {
      object[key] = value;
      trigger(object, key);
      return true;
    },
  });
}
```

The `get` trap observes a read and the `set` trap observes a write. Only using the proxy preserves this connection: mutating the original object directly bypasses its traps.

---

## Identify the active effect

`track()` needs to know which function is reading the property. Before running an effect, the model temporarily stores it as `activeEffect`:

```js
let activeEffect;

function effect(fn) {
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
```

A read outside effect execution does not create a dependency because there is no work to subscribe. `finally` prevents an effect from accidentally remaining active if the function throws.

---

## Build the dependency graph

A key alone does not identify a property: different objects can both have a key named `count`. The graph therefore relates three elements:

```text
target object → property key → dependent effects
```

A reduced model can represent it like this:

```js
const targetMap = new WeakMap();

function track(target, key) {
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
```

The `WeakMap` associates information with each object without preventing JavaScript from collecting it when it is no longer used. The `Map` separates its properties, and the `Set` prevents the same effect from being registered twice for one property.

---

## Notify only related work

`trigger()` walks the graph in reverse: it locates the object, then the changed key, and finally its effects.

```js
function trigger(target, key) {
  const dependenciesMap = targetMap.get(target);
  const effects = dependenciesMap?.get(key);

  if (!effects) return;

  new Set(effects).forEach((effect) => effect());
}
```

Copying the `Set` creates a stable list before running the effects. This prevents subscription changes during execution from altering the current iteration.

If one effect depends on `count` and another depends on `name`, changing `count` only notifies the first. This fine-grained selection is the purpose of the graph.

---

## Dependencies can change

An effect does not always read the same properties:

```js
effect(() => {
  message = state.showDetails ? state.details : state.summary;
});
```

When `showDetails` is `true`, the effect depends on `details`. If it later becomes `false`, the effect should leave that dependency and begin depending on `summary`. Keeping old subscriptions would cause unnecessary executions.

Before collecting dependencies for a new run, a complete effect therefore removes its previous connections:

```js
function cleanup(effect) {
  effect.dependencies.forEach((effects) => effects.delete(effect));
  effect.dependencies.length = 0;
}
```

For this to work, `track()` also records each `Set` in a list owned by the effect. The relationship can then be traversed in both directions:

```text
property → effects
effect → tracked properties
```

---

## Nested effects

One `activeEffect` variable is not enough if an effect runs another effect. When the inner effect finishes, the outer effect must be restored so its following reads are tracked correctly.

```js
const effectStack = [];

function runEffect(effect) {
  effectStack.push(effect);
  activeEffect = effect;

  try {
    effect.fn();
  } finally {
    effectStack.pop();
    activeEffect = effectStack.at(-1);
  }
}
```

The stack preserves execution context. Without it, reads made by the outer effect after the inner effect would be left untracked or associated with the wrong effect.

---

## Run and stop an effect

Returning a runner allows an effect to be executed manually without creating a new subscription each time. An effect must also be stoppable when its work is no longer needed.

```js
const run = effect(() => {
  total = state.price * state.quantity;
});

run();
stop(run);
```

Stopping it means removing it from every `Set` stored in `effect.dependencies`. A later manual run may still calculate the result, but it should not automatically subscribe again while it remains stopped.

This ability avoids retaining work and references that no longer have consumers. Vue manages the lifetime of many effects when components are unmounted and when watchers or scopes are stopped.

---

## The complete model

The fundamental path now looks like this:

```text
run effect
→ mark it active
→ intercept reads
→ store dependencies
→ intercept a write
→ find subscribers
→ run related work
```

Cleanup keeps dynamic dependencies correct, the stack preserves nested-effect context, and `stop()` ends an effect's lifetime.

The following subcategories will reuse this foundation to explain primitives such as `ref`, derived state, scheduling, and rendering. Here, the important idea is the graph that connects a read with the work that a later write must notify.
