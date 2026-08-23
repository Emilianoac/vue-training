---
documentId: reactive-primitives-lesson
title: Rebuilding Reactive Primitives
level: basic
description: Understand how reactive, ref, readonly, toRef, and toRefs reuse dependency tracking.
---

## One foundation, multiple primitives

Vue needs to observe values with different shapes: objects whose properties change, replaceable primitives, readonly views, and properties that must preserve their link when transported. Its reactive primitives address these needs through different paths into the same dependency model:

- `reactive()` intercepts an object's properties.
- `ref()` represents any value through a `.value` property.
- `readonly()` exposes an object without allowing writes through that view.
- `toRef()` creates a reference linked to an existing property.
- `toRefs()` creates that link for multiple properties.

The implementations in this lesson are reduced pedagogical models. They share the essential behavior of these APIs without reproducing every optimization, collection, or edge case in Vue's source code.

---

## Build reactive with a Proxy

`reactive()` receives an object and returns a `Proxy`. Its traps connect every read to `track()` and every effective write to `trigger()`:

```js
function isObject(value) {
  return value !== null && typeof value === 'object';
}

function reactive(target) {
  if (!isObject(target)) return target;

  return new Proxy(target, {
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
}
```

`Reflect.get()` and `Reflect.set()` preserve the object's normal access semantics. Comparing with `Object.is()` avoids notifying effects when an assignment does not actually change the value.

The `get` trap converts nested objects when they are read. This lazy conversion avoids traversing the entire tree in advance and lets a read such as `state.user.name` track both `user` and `name`.

---

## Preserve proxy identity

The previous version creates a new proxy whenever it encounters the same nested object. That breaks identity comparisons and produces unnecessary wrappers:

```js
state.user === state.user; // should be true
```

A `WeakMap` can remember the proxy created for each target object:

```js
const reactiveCache = new WeakMap();

function reactive(target) {
  if (!isObject(target)) return target;

  const cachedProxy = reactiveCache.get(target);
  if (cachedProxy) return cachedProxy;

  const proxy = new Proxy(target, reactiveHandlers);
  reactiveCache.set(target, proxy);
  return proxy;
}
```

The cache makes the `original object → proxy` relationship stable. It also allows the original object to be collected when it is no longer used because `WeakMap` keys do not retain it by themselves.

The proxy and the original object are still different identities. Reactive reads and writes must go through the proxy to reach its traps.

---

## Give any value a reactive property

A `Proxy` can only wrap objects. A number or string has no properties that can be intercepted, but a container does. `ref()` places the value in `.value` and tracks that property:

```js
function toReactive(value) {
  return isObject(value) ? reactive(value) : value;
}

function ref(initialValue) {
  let rawValue = initialValue;
  let currentValue = toReactive(initialValue);

  const reference = {
    get value() {
      track(reference, 'value');
      return currentValue;
    },
    set value(nextValue) {
      if (Object.is(rawValue, nextValue)) return;

      rawValue = nextValue;
      currentValue = toReactive(nextValue);
      trigger(reference, 'value');
    },
  };

  return reference;
}
```

The `.value` getter and setter play the same role as a proxy's traps. Storing `rawValue` separately lets the model compare the new assignment before converting an object into reactive state.

If a ref's value is an object, `toReactive()` converts it deeply as its properties are accessed. The ref can also replace the entire object because the replaceable identity lives in `.value`.

---

## Expose a readonly view

`readonly()` does not freeze or copy state. It creates another proxy that allows reads but rejects writes made through it:

```js
function readonly(target) {
  if (!isObject(target)) return target;

  return new Proxy(target, {
    get(object, key, receiver) {
      const value = Reflect.get(object, key, receiver);
      return isObject(value) ? readonly(value) : value;
    },
    set(object, key) {
      console.warn(`Cannot set ${String(key)} on readonly state`);
      return true;
    },
  });
}
```

Nested conversion extends the restriction to inner objects. A complete implementation keeps these proxies in a separate cache to preserve their identity.

When the source is already reactive, `readonly(state)` keeps a live connection to it: reading the view reaches the underlying reactive proxy and can collect dependencies. Changing `state` updates its consumers, while writing through the readonly view is blocked.

```js
const state = reactive({ count: 0 });
const publicState = readonly(state);

state.count += 1;       // allowed
publicState.count += 1; // blocked
```

`readonly()` therefore expresses who may mutate state; it does not create an immutable snapshot.

---

## Preserve the link when destructuring

Destructuring a reactive property copies its current value into a local variable. That variable no longer goes through the proxy:

```js
const state = reactive({ count: 0 });
const { count } = state;

state.count += 1;
console.log(count); // 0
```

`toRef()` solves this problem with an object whose `.value` property delegates reads and writes to the original property:

```js
function toRef(object, key, defaultValue) {
  return {
    get value() {
      const value = object[key];
      return value === undefined ? defaultValue : value;
    },
    set value(nextValue) {
      object[key] = nextValue;
    },
  };
}
```

This ref does not store a copy or need a separate graph. Reading `count.value` actually reads `state.count`, so the proxy handles `track()`. Writing `count.value` mutates `state.count`, so the proxy calls `trigger()`.

```js
const count = toRef(state, 'count');

count.value += 1;
console.log(state.count); // 1
```

The link works in both directions. If the object is readonly, the ref's setter also reaches that view's restriction.

---

## Convert multiple properties with toRefs

`toRefs()` applies `toRef()` to the enumerable properties that exist when it is called:

```js
function toRefs(object) {
  const result = Array.isArray(object) ? new Array(object.length) : {};

  Object.keys(object).forEach((key) => {
    result[key] = toRef(object, key);
  });

  return result;
}
```

Destructuring now preserves ref objects instead of copying loose values:

```js
const state = reactive({ count: 0, label: 'Total' });
const { count, label } = toRefs(state);
```

`count.value` and `label.value` remain linked to their corresponding properties. However, a property added to `state` after calling `toRefs()` does not automatically appear in the result. To link an optional or future key, use `toRef(state, 'newKey')` directly.

---

## Choose the shape of the link

These primitives do not represent five separate systems. They all create a read-and-write path into the same dependency model:

```text
reactive → property intercepted by a Proxy
ref      → value property with a getter and setter
readonly → view that preserves reads and blocks writes
toRef    → value linked to an existing property
toRefs   → set of links created property by property
```

`reactive()` is natural for an object whose identity remains stable while its properties change. `ref()` adds a replaceable identity and also supports primitives. `readonly()` limits write authority, while `toRef()` and `toRefs()` let properties travel without losing their connection.

Under these shapes are the same questions: which read should call `track()`, which write should call `trigger()`, and which identity represents the dependency. Understanding those decisions makes each primitive easier to reason about as a variation of the same mechanism, not as an isolated or magical API.
