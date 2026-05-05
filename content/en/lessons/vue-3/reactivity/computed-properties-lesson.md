---
documentId: computed-properties-lesson
title: Vue 3 Reactivity Fundamentals
level: basic
description: Core concepts about computed properties, caching, and key differences from traditional methods.
---

In Vue development, state derivation is the process of calculating values from other existing state sources. Instead of manually mutating a variable every time another one changes, we use tools that react and compute the new value automatically.

Imagine you have a counter (`count`) and you want to display its doubled value (`doubleCount`). Instead of writing code to update `doubleCount` every time `count` changes, Vue offers an elegant solution: computed properties.

---

## What is computed?

The `computed()` function takes a getter function and returns a read-only reactive ref object for the returned value. Its most important characteristic is caching.

A computed property will only re-evaluate when one of its reactive dependencies has changed. If the dependencies don't change, any access to the computed will return the previously cached result without executing the logic again.

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
    <button @click="count++">Increment</button>
  </div>
</template>
```

---

## Computed vs Methods
Although they may look similar in the template, their internal behavior defines when to use each one.

### Computed Properties

- **Smart caching:** Ideal for expensive operations (filtering large arrays, complex calculations).
- **Declarative:** They represent a derived value.
- **Synchronous:** Must be pure and synchronous functions.

### Methods
- **No caching:** They run every time they are accessed, regardless of whether dependencies have changed.
- **Imperative:** Ideal for API calls, state mutations, or event handling (clicks, submit).
- **Arguments:** Can accept parameters, unlike computed properties.


### When to use each one


| Scenario                         | Computed?          | Method?  | Reason                                                                |
|----------------------------------|--------------------|----------|-----------------------------------------------------------------------|
| Format a single date             | Yes                | Optional | Benefits from caching if it depends on reactive state                 |
| Format many dates                | No                 | Yes      | Computed doesn't accept parameters and doesn't scale well             |
| Filter list by input             | Yes (generally)    | Sometimes| Depends on data size and update frequency                             |
| Send data to backend             | No                 | Yes      | It's an action, not a derived value                                   |
| Logic with parameters            | No                 | Yes      | Computed properties don't receive arguments


## Rules for using computed

- **Read-only:** By default, don't try to assign values to a computed property (`myComputed.value = x` will fail).

- **No side effects:** Don't make fetch requests, don't modify the DOM, and don't change other reactive variables inside a computed. Its only purpose is to return a value.

- **Avoid mutating the original state:** If you need to sort a list in a computed, use `.toSorted()` or a copy of the original array to avoid altering the source of truth.

Implementation example:

```vue
<script setup>
import { ref, computed } from "vue";
const search = ref('')
const users = ref(['Alice', 'Bob', 'Charlie'])

// Efficient: Only filters when 'search' or 'users' change
const filteredUsers = computed(() => {
  return users.value.filter(user => user.toLowerCase().includes(search.value.toLowerCase()));
})
</script>

<template>
  <div>
    <input v-model="search" placeholder="Search users..." />
    <ul>
      <li v-for="user in filteredUsers" :key="user">{{ user }}</li>
    </ul>
  </div>
</template>
```