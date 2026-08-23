---
documentId: derived-state-observation-lesson
title: Derived State and Reactive Observation
level: basic
description: Understand how computed, watch, and watchEffect react through caching, invalidation, and cleanup.
---

## Derive and observe

A reactive value can participate in two different kinds of work. Sometimes another value must be calculated from it; at other times a side effect must run when it changes.

- `computed()` produces derived state and caches its latest result.
- `watch()` observes an explicit source and provides its new and previous values.
- `watchEffect()` runs work immediately and discovers its dependencies during that execution.

These APIs react to dependencies, but they do not pursue the same goal. A computed value describes a value and should remain free of side effects. A watcher coordinates work such as requests, persistence, or integration with external APIs.

The following implementations are reduced pedagogical models. They explain the relationships between effects, invalidation, and cleanup while omitting optimizations and internal edge cases from Vue's production code.

---

## Separate invalidation from execution

A basic effect runs its function again when a dependency changes. Derived state and watchers need a second possibility: report the change without deciding yet when or how to run the function.

A `scheduler` hook provides that control point:

```js
function trigger(target, key) {
  const effects = getEffects(target, key);

  new Set(effects).forEach((effect) => {
    if (effect.scheduler) {
      effect.scheduler();
    } else {
      effect.run();
    }
  });
}
```

Here, scheduler does not necessarily mean an asynchronous queue. It is a function that receives the notification instead of directly running the reactive calculation. A computed value can use it to mark its cache as invalid, while a watcher can use it to run its own job.

The system also needs `lazy` effects. Their function does not run when they are created, but when a consumer requests the result.

---

## Build a computed value

A readonly `computed` receives a getter. Its container combines three responsibilities:

1. Store the last calculated value.
2. Know whether the cache is dirty.
3. Expose a reactive `.value` property.

```js
function computed(getter) {
  let cachedValue;
  let dirty = true;

  const computedRef = {
    get value() {
      track(computedRef, 'value');

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
      trigger(computedRef, 'value');
    },
  });

  return computedRef;
}
```

The first read runs the getter. Later reads return `cachedValue` while no dependency has changed. When a dependency notifies the scheduler, it only sets `dirty = true`; the getter does not run again until the next read.

Invalidating is therefore not the same as recomputing. Invalidation withdraws trust in the cache, and a read decides when to renew it.

---

## Be both dependency and consumer

A computed value occupies two positions in the reactive graph:

```text
source state → computed effect → computed.value → consumer effect
```

Its runner consumes the properties read by the getter. At the same time, `computedRef.value` acts as a source that other effects can track.

```js
const price = ref(10);
const quantity = ref(2);
const total = computed(() => price.value * quantity.value);

effect(() => {
  renderTotal(total.value);
});
```

If `price` changes, the computed value is invalidated and notifies consumers of `total.value`. When one of them reads it again, the getter calculates the updated value once. Multiple consumers can share that same cache.

This composition requires the effect system to restore the consumer effect correctly after running the inner getter. Otherwise, later reads could be associated with the wrong subscriber.

---

## Readonly and writable computed values

The common form of `computed()` receives only a getter and exposes a readonly ref. It can also receive `get` and `set` to create a writable derived value:

```js
const fullName = computed({
  get() {
    return `${firstName.value} ${lastName.value}`;
  },
  set(value) {
    [firstName.value, lastName.value] = value.split(' ');
  },
});
```

The setter does not mutate the cache directly. It translates the write into changes to the sources. Those changes invalidate the getter through the normal reactive flow.

A writable computed value is useful when there is a clear reversible transformation. If a write represents an action with several rules or side effects, an explicit function usually communicates the intent better.

---

## Observe an explicit source

`watch()` separates dependency collection from the side effect. A source function runs inside a lazy effect; the callback is not used to discover dependencies.

```js
function watch(source, callback, options = {}) {
  const getter = typeof source === 'function'
    ? source
    : () => source.value;

  let oldValue;
  let cleanup;
  let initialized = false;

  function onCleanup(fn) {
    cleanup = fn;
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

  return () => stop(runner);
}
```

Without `immediate`, the first run only establishes `oldValue`. Each later invalidation obtains `newValue`, compares it, and calls the callback when the result changes. With `immediate`, the job also runs the initial callback while the previous value is still `undefined`.

Vue accepts refs, getters, reactive objects, and arrays of sources. A getter is especially useful for observing a specific property:

```js
watch(
  () => state.user.id,
  (newId, oldId) => loadUser(newId),
);
```

Reading `state.user.id` before passing it would copy its value and lose the reactive source. The getter keeps the read inside the tracking context.

---

## Observe deep structures

A getter source only tracks the properties it reads. To detect inner mutations across a complete structure, a deep watcher must traverse it and cause reactive reads:

```js
function traverse(value, seen = new Set()) {
  if (value === null || typeof value !== 'object' || seen.has(value)) {
    return value;
  }

  seen.add(value);
  Object.values(value).forEach((item) => traverse(item, seen));
  return value;
}
```

The `Set` prevents infinite cycles when two objects reference each other. This traversal has a cost proportional to the visited structure, so observing specific sources is usually more precise than enabling depth without needing it.

For a nested mutation, `newValue` and `oldValue` can be the same proxy because the object was not replaced. The watcher reports that invalidation occurred; it does not automatically create a historical copy of the entire structure.

---

## Discover dependencies with watchEffect

`watchEffect()` combines tracking and side effect in one function. It runs immediately, and every reactive value read during its synchronous portion becomes a dependency:

```js
const stop = watchEffect((onCleanup) => {
  document.title = `${user.value.name} · ${notifications.value.length}`;
});
```

It needs no source list, but its dependencies are less explicit. A reduced implementation can wrap the function and run its cleanup before every repetition:

```js
function watchEffect(fn) {
  let cleanup;

  function onCleanup(nextCleanup) {
    cleanup = nextCleanup;
  }

  const runner = effect(() => {
    cleanup?.();
    cleanup = undefined;
    fn(onCleanup);
  });

  return () => {
    cleanup?.();
    stop(runner);
  };
}
```

With an `async` function, only reads made before the first `await` belong to the synchronous execution and are tracked automatically. A later read occurs after the same active effect context has ended.

---

## Invalidate stale side effects

A watcher can start work that remains active when a new invalidation arrives. Without cleanup, an old response could overwrite newer data:

```js
watch(userId, async (id, _oldId, onCleanup) => {
  const controller = new AbortController();

  onCleanup(() => controller.abort());

  const response = await fetch(`/api/users/${id}`, {
    signal: controller.signal,
  });

  user.value = await response.json();
});
```

`onCleanup()` registers work that runs immediately before the next repetition or when the watcher stops. Cleanup does not undo the previous callback; it cancels or releases the resources that callback left active.

Vue also provides `onWatcherCleanup()`. That API must be registered during the callback's synchronous execution, before any `await`. The `onCleanup` argument is bound to the specific watcher instance and fits naturally into the reduced model.

---

## Control lifetime

`watch()` and `watchEffect()` return a handle. Stopping it removes its subscriptions and runs pending cleanup:

```js
const handle = watchEffect((onCleanup) => {
  const connection = connect(roomId.value);
  onCleanup(() => connection.close());
});

handle.stop();
```

Vue's handle can also be called as a function and provides `pause()` and `resume()`. When a watcher is created synchronously inside `setup()`, Vue associates it with the component and stops it when that component unmounts. One created outside that context needs explicit lifetime management.

Derived state and observation share the reactive graph, but they respond differently to invalidation. `computed` protects a cache and produces a value; `watch` compares a declared source; `watchEffect` repeats work that discovered its own dependencies. Cleanup prevents obsolete executions from continuing to control resources or results.
