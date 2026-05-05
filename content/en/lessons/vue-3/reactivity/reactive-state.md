---
documentId: reactive-state
title: Fundamentals of Reactivity in Vue 3
level: basic
description: Learn the fundamental concepts of reactivity in Vue 3.
---

## What is reactivity?
Reactivity is the mechanism that allows the user interface to automatically stay in sync with the application's state.

In technical terms, it is a design pattern that allows Vue to intercept access to and modification of data in order to trigger side effects (such as updating the DOM).

``` vue
<script setup>
import { reactive } from "vue";
const state = reactive({ count: 0 });
// When you do this:
state.count++;
// Vue detects the change and automatically updates the interface.
</script>
```

## How does reactivity work in Vue?
In plain JavaScript, if you have `a = 1` and `b = a + 1`, and then you change `a = 5`, the value of `b` will still be 2.  
There is no automatic link.

``` javascript
let a = 1;
let b = a + 1; // b is 2
a = 5; // b is still 2, it does not change automatically
```

Vue uses JavaScript Proxies to "wrap" your data. This way, Vue can intercept when you access or modify a property.

When you access a value, Vue uses `track` to save which functions are using it.  
When that value changes, Vue uses `trigger` to re-run those functions.

``` javascript
function reactive(target) {
  return new Proxy(target, {
    get(obj, prop) {
      track(obj, prop); // saves which depends on this property
      return obj[prop];
    },
    set(obj, prop, value) {
      obj[prop] = value;
      trigger(obj, prop); // re-runs those dependencies
      return true;
    }
  });
}
```

## Reactive State
In Vue, reactive state refers to the data in your application that can change over time and whose update is automatically reflected in the user interface.

There are two main ways to declare reactive state in the Composition API: `ref` and `reactive`.

### ref()
This is the most common approach. It can hold any type of data (primitives like strings and numbers, or objects).

- **Access:** In the `<script>` block, you must always use `.value`. In the `<template>`, Vue automatically unwraps it.

```vue
<script setup>
import { ref } from "vue";

const count = ref(0);
const name = ref("Vue Developer");

// To modify:
count.value++;
</script>
```
--- 

### reactive()
It only works with objects or arrays. It does not support primitive types.

- **Access:** It does not use `.value`. It behaves like a normal object.

- **Limitation:** If you try to destructure it (e.g., `const { x } = reactive({...})`), you lose reactivity unless you use utilities like `toRefs`.

```vue
<script setup>
import { reactive } from "vue";

const user = reactive({
  name: "Vue User",
  score: 10
});

// To modify:
user.score += 5;
</script>
```

## Optimization: shallowRef and shallowReactive
Sometimes, wrapping very large or complex objects (like a map instance or a data buffer) in deep reactivity can impact performance. For this, there are "shallow" versions.

### shallowRef()
Unlike `ref`, Vue only tracks changes when you reassign `.value`. It does **not track changes** in the object's internal properties.

```vue
<script setup>
const state = shallowRef({ count: 1 });

// This does NOT trigger a UI update:
state.value.count = 2;

// This DOES trigger an update:
state.value = { count: 2 };
</script>
```
--- 

### shallowReactive()
Similar to `reactive`, but only the root level of the object is reactive. Nested properties are not converted into proxies.  
It is ideal when working with read-only data structures or integrating third-party libraries.

```vue
<script setup>
const state = shallowReactive({
  user: {
    name: "Vue User",
    score: 10
  }
});

// This does NOT trigger a UI update:
state.user.score += 5;
</script>
```

## Usage Comparison Table
| Tool               | Data Type              | Script Access | Deep Reactivity |
|--------------------|------------------------|---------------|-----------------|
| `ref()`            | Primitives and objects | `.value`      | Yes             |
| `reactive()`       | Objects/arrays only    | Direct        | Yes             |
| `shallowRef()`     | Primitives and objects | `.value`      | No              |
| `shallowReactive()`| Objects/arrays only    | Direct        | No              |