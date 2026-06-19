---
documentId: computed-properties-lesson
title: Computed Properties in Vue 3
level: basic
description: Fundamental concepts about computed properties, caching, and key differences from traditional methods.
---

## What is a computed property?

In Vue development, a computed property is a way to derive state from other reactive data. In other words, it allows you to automatically calculate values based on changes in other variables, without needing to update them manually.

Imagine you have a counter (`count`) and you want to display its doubled value (`doubleCount`). Instead of writing code to update `doubleCount` every time `count` changes, you can define it as a computed property.

This way, Vue takes care of recalculating the value only when necessary:

```vue
<script setup>
import { ref, computed } from "vue";

const count = ref(0);

// The function inside computed will only run when count changes
const doubleCount = computed(() => count.value * 2);
</script>
```
--- 

## How does computed() work?

The `computed()` function takes a getter function and returns a read-only reactive ref for the returned value.

Its most important feature is caching.

Vue automatically detects which reactive values are used inside the computed function and registers them as dependencies. A computed property will only be re-evaluated when one of those dependencies changes.

If the dependencies do not change, any access to the computed property will return the previously cached result without running the logic again.

```vue
<script setup>
import { ref, computed } from "vue";

const count = ref(0);

// The function inside computed will only run when count changes
const doubleCount = computed(() => count.value * 2);
</script>

<template>
  <div>
    <p>Count: {{ count }}</p>
    <p>Double Count: {{ doubleCount }}</p>

    <button @click="count++">
      Increment
    </button>
  </div>
</template>
```
---

## Computed properties vs methods

Although they may look similar in the template, the difference appears when Vue updates the interface: computed properties are recalculated only when their dependencies change, while methods run every time the component renders or the template needs them.

---

### Computed properties

Computed properties are designed to represent values derived from reactive state.

- Vue automatically caches their result.
- They are only recalculated when their dependencies change.
- They are ideal for transforming or deriving reactive data.
- They do not receive parameters.
- They should return a value and avoid side effects.

---

### Methods

Methods are designed to execute logic or actions inside the component.

- They run every time the component renders.
- They do not cache results.
- They can receive parameters.
- They are useful for handling events or executing actions.
- They can produce side effects.

---

### When to use each one

| Scenario                      | Computed?      | Method?  | Reason                                                        |
| ----------------------------- | -------------- | -------- | ------------------------------------------------------------- |
| Format a single date          | Yes            | Optional | Benefits from caching if it depends on reactive state         |
| Logic with dynamic parameters | No             | Yes      | Computed properties do not receive arguments                  |
| Filter a list by input        | Yes, generally | Sometimes| Depends on data size and update frequency                     |
| Send data to a backend        | No             | Yes      | It is an action, not a derived value                          |
| Execute user actions          | No             | Yes      | Methods represent behavior                                    |

---

## Rules for using computed

- **Read-only by default:** a normal computed property cannot be modified directly, although you can create a writable computed property using `get` and `set`.
- **No side effects:** do not make `fetch` requests, modify the DOM, or change other reactive variables inside a computed property. Its only purpose is to return a value.
- **Avoid mutating the original state:** if you are going to sort a list inside a computed property, use `.toSorted()` or a copy of the original array so you do not alter the source of truth.
- **They must be deterministic:** avoid using values like `Math.random()` or `Date.now()` inside a computed property, since they do not depend on reactivity and caching loses its purpose.

---

## Writable computed properties

By default, a computed property is read-only. This means you can read its value, but you cannot assign a new one to it directly.

```js
const doubleCount = computed(() => count.value * 2);

doubleCount.value = 10; // Error
```

However, Vue also allows you to create writable computed properties using a `get` and a `set`.

The `get` defines how the value is calculated, while the `set` defines what should happen when someone tries to modify it.

```vue
<script setup>
import { ref, computed } from "vue";

const firstName = ref("Ada");
const lastName = ref("Lovelace");

const fullName = computed({
  get() {
    return `${firstName.value} ${lastName.value}`;
  },
  set(newValue) {
    const [first, last] = newValue.split(" ");

    firstName.value = first;
    lastName.value = last;
  }
});
</script>

<template>
  <div>
    <p>{{ fullName }}</p>

    <input v-model="fullName" />
  </div>
</template>
```

In this example, `fullName` is still a derived value, but it can also update the original variables when it changes.

Writable computed properties are useful when you need to expose a simple interface for reading and modifying several related reactive values.

---

## Implementation example

```vue
<script setup>
import { ref, computed } from "vue";

const search = ref("");

const users = ref([
  "Alice",
  "Bob",
  "Charlie"
]);

// Efficient: only filters when search or users change
const filteredUsers = computed(() => {
  return users.value.filter(user =>
    user.toLowerCase().includes(search.value.toLowerCase())
  );
});
</script>

<template>
  <div>
    <input
      v-model="search"
      placeholder="Search users..."
    />

    <ul>
      <li
        v-for="user in filteredUsers"
        :key="user"
      >
        {{ user }}
      </li>
    </ul>
  </div>
</template>
```