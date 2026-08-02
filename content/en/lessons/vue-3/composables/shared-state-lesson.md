---
documentId: shared-state-lesson
title: Shared State with Composables
level: basic
description: Learn how state placement determines whether each consumer receives an isolated instance or shares one reactive source.
---

## State scope

When creating a composable, the location of a `ref` or `reactive` object determines who can observe it and how long it remains active.

State can belong to each consumer or live in the module to be shared. Neither option is always better: the choice depends on whether consumers must stay synchronized.

---

## Per-instance state

When state is declared inside the composable, each call creates new refs.

```ts
import { ref } from "vue";

export function useDisclosure() {
  const isOpen = ref(false);

  function toggle() {
    isOpen.value = !isOpen.value;
  }

  return { isOpen, toggle };
}
```

```ts
const firstPanel = useDisclosure();
const secondPanel = useDisclosure();

firstPanel.toggle();

console.log(firstPanel.isOpen.value); // true
console.log(secondPanel.isOpen.value); // false
```

This scope works well for forms, panels, and any state that should evolve independently in each component.

---

## Module state

When state is declared outside the function, the module creates a single reference. Every composable call returns access to the same state.

```ts
import { readonly, ref } from "vue";

const savedLessons = ref<string[]>([]);

export function useReadingList() {
  function saveLesson(lessonId: string) {
    if (!savedLessons.value.includes(lessonId)) {
      savedLessons.value.push(lessonId);
    }
  }

  function reset() {
    savedLessons.value = [];
  }

  return {
    savedLessons: readonly(savedLessons),
    saveLesson,
    reset,
  };
}
```

Two components that call `useReadingList()` observe the same list. When one saves a lesson, the other updates reactively.

---

## A controlled API

Sharing state does not mean every consumer should mutate it directly. Returning a `readonly` view and exposing actions keeps the rules in one place.

```ts
return {
  savedLessons: readonly(savedLessons),
  saveLesson,
  reset,
};
```

This API prevents accidental assignments from components and makes it easier to change the implementation without modifying every consumer.

---

## Lifetime

State created inside a composable belongs to whoever retains that instance. When no references remain, it can be released.

Module state lives while the module stays loaded. Unmounting a consumer component does not automatically reset its values. This can preserve a selection during navigation, but it can also retain data longer than expected.

A `reset` action restores a known state when signing out, leaving a feature, or preparing each test.

---

## Shared state and SSR

In a traditional client application, a loaded module represents one browser session. With server-side rendering, the same module can serve multiple requests.

A singleton created directly in module scope can therefore leak state between users if the server runtime reuses that instance.

SSR frameworks provide mechanisms that isolate state per request. In Nuxt, for example, `useState` creates shared, hydratable state with a stable key.

```ts
export function useReadingList() {
  const savedLessons = useState<string[]>("reading-list", () => []);

  return { savedLessons };
}
```

In an SSR application, use the framework's recommended state mechanism or a store configured correctly for that environment.

---

## Other scopes

Module scope is not the only way to share state:

- **Props and events** connect components with a direct relationship.
- **Provide and inject** share dependencies within a specific subtree.
- **A module-state composable** synchronizes consumers in a client application.
- **A store** organizes global state with more rules, tooling, and mutation paths.

Choose the smallest scope that includes every required consumer.

---

## When to use a store

A shared composable can be enough for small state with few actions. A store is more suitable when you have:

- Multiple domains or many business rules.
- Many places capable of modifying state.
- Requirements for devtools, plugins, or structured persistence.
- Difficulty tracing why a value changed.

You do not need to wait until the composable becomes unmanageable. The tool can change when its contract begins to resemble a store.

---

## Decision guide

| Need | Possible scope |
| --- | --- |
| Independent state per component | Inside the composable |
| State shared within a subtree | Provide and inject |
| Small shared state in an SPA | Module scope |
| Shared state in Nuxt with SSR | `useState` or a compatible store |
| Global state with many rules and tools | Store |

---

## General rule

> Start with per-instance state. Share it only when multiple consumers need the same source of truth, and choose a mechanism compatible with the scope and rendering environment.
