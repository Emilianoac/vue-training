---
documentId: basic-composables-lesson
title: Basic Composables in Vue 3
level: basic
description: Learn to encapsulate reactive logic in functions, design a clear API, and consume composables from Vue components.
---

## Composables

A **composable** is a function that uses the Composition API to encapsulate logic with reactive state. It moves that logic outside a component without moving its template.

Composables are commonly used to share behavior, but reuse is not their only purpose. They can also organize a complex responsibility and let the component focus on the interface.

---

## First composable

This composable encapsulates a boolean state and the actions that can modify it.

```ts
// composables/useToggle.ts
import { ref } from "vue";

export function useToggle(initialValue = false) {
  const value = ref(initialValue);

  function toggle() {
    value.value = !value.value;
  }

  function setValue(nextValue: boolean) {
    value.value = nextValue;
  }

  return {
    value,
    toggle,
    setValue,
  };
}
```

The function keeps its implementation details private and returns a small API: reactive state and two actions.

---

## Consuming a composable

A component can call the composable inside `<script setup>` and use its returned values in both the script and the template.

```vue
<script setup lang="ts">
import { useToggle } from "~/composables/useToggle";

const { value: isOpen, toggle } = useToggle();
</script>

<template>
  <button @click="toggle">Toggle details</button>
  <p v-if="isOpen">Additional information</p>
</template>
```

Returning refs preserves reactivity even after destructuring the result.

---

## The use convention

By convention, composable names begin with `use`:

- `useToggle`
- `useSearch`
- `useFormValidation`

The prefix communicates that the function may use reactive state, computed properties, watchers, or lifecycle hooks. It also makes composables easier to recognize and find in a project.

---

## Public API

A composable should expose what its consumer needs, not every internal detail.

```ts
import { computed, ref } from "vue";

export function usePasswordStrength() {
  const password = ref("");

  const strength = computed(() => {
    if (password.value.length < 6) return "weak";
    if (password.value.length < 10) return "medium";
    return "strong";
  });

  return {
    password,
    strength,
  };
}
```

The calculation remains encapsulated. Consumers can update `password` and read `strength` without knowing the internal rules.

API names should express their purpose:

- State: `users`, `query`, `error`.
- Derived values: `filteredUsers`, `isValid`.
- Actions: `load`, `reset`, `toggle`.

---

## When to extract logic

A composable can be useful when logic:

- Repeats across multiple components.
- Has state and rules that form a recognizable responsibility.
- Hides the component's visual purpose through its size or complexity.
- Needs to be tested independently from the interface.

You do not need to move every `ref` into a separate file. Small visual state that belongs to one component can remain beside its template.

---

## Composable and component

| Need | Tool |
| --- | --- |
| Render visual structure | Component |
| Encapsulate reactive logic | Composable |
| Share a complete visual interaction | Component |
| Reuse state and actions without imposing UI | Composable |

Both tools work together: the composable provides behavior and the component decides how to represent it.

---

## Execution context

Composables that use Vue hooks must be called from `<script setup>` or `setup()`. The call must also happen synchronously while the component is being set up.

```vue
<script setup>
import { useToggle } from "~/composables/useToggle";

const { value, toggle } = useToggle();
</script>
```

This context lets Vue associate watchers and lifecycle hooks with the active component instance and clean them up when it unmounts.

---

## Common mistakes

- Returning a reactive object and destructuring it, which disconnects its properties from reactivity.
- Exposing internal state that no consumer needs.
- Mixing markup or visual decisions into the composable.
- Extracting tiny logic without gaining clarity or reuse.
- Calling a composable that depends on component context outside `setup()`.

---

## General rule

> A composable encapsulates a reactive responsibility behind a clear API. Extract one when it simplifies a component, enables behavior reuse, or makes logic easier to understand and test.
