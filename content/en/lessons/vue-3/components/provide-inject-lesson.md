---
documentId: provide-inject-lesson
title: Sharing Context with Provide and Inject
level: basic
description: Learn to share reactive values between ancestors and descendants without passing props through every level of the tree.
---

## Props drilling

Props make communication between a parent and child explicit. However, a value can end up passing through several components that do not use it just to reach a deeply nested descendant.

```txt
App -> Layout -> Sidebar -> UserMenu
```

If only `UserMenu` needs the current user, forcing `Layout` and `Sidebar` to receive and forward that prop creates **props drilling**.

---

## Provide and Inject

Vue lets an ancestor publish a dependency with `provide()` and any descendant in its subtree retrieve it with `inject()`.

Intermediate components do not need to know about or forward the value.

```txt
App (provide) -> Layout -> Sidebar -> UserMenu (inject)
```

---

## Provide

`provide()` receives a key and the value that will be available to descendants.

```vue
<script setup>
import { provide, ref } from "vue";

const theme = ref("light");

provide("theme", theme);
</script>
```

The dependency is only available inside the provider component's subtree.

---

## Inject

A descendant uses the same key to retrieve the dependency.

```vue
<script setup>
import { inject } from "vue";

const theme = inject("theme");
</script>

<template>
  <p>Current theme: {{ theme }}</p>
</template>
```

The key must exactly match the one used by `provide()`.

---

## Default values

When no provider exists for the requested key, `inject()` returns `undefined`. You can pass a second argument as a fallback value.

```js
const theme = inject("theme", "light");
```

This lets a component work outside the context that normally provides the dependency.

---

## Reactivity

If the provider shares a `ref` or a `reactive` object, descendants keep the reactive connection.

```vue
<script setup>
import { provide, ref } from "vue";

const theme = ref("light");

function toggleTheme() {
  theme.value = theme.value === "light" ? "dark" : "light";
}

provide("theme", theme);
</script>
```

When the provider changes `theme.value`, every descendant that injected the ref receives the new value.

---

## Mutations

Although a descendant can receive a mutable ref, it is often clearer for the provider to control how state changes. It can provide the value together with specific operations.

```js
provide("themeContext", {
  theme,
  toggleTheme,
});
```

The descendant consumes the operation without knowing its internal details.

```js
const themeContext = inject("themeContext");

themeContext?.toggleTheme();
```

---

## Nearest provider

Several ancestors can provide the same key. In that case, `inject()` uses the closest provider in the component tree.

This makes it possible to override a context for a specific part of the interface.

---

## When to use it

`provide` and `inject` work well when a dependency belongs to a subtree context:

- a local theme,
- compound form state,
- panel configuration,
- information shared by several descendants.

---

## When to avoid it

- For direct parent-child communication, props and emits are more explicit.
- For application-wide global state, a store may offer better tools.
- If only one component needs the value, creating an implicit dependency can add unnecessary complexity.

Overusing `inject()` can also make it harder to discover where values come from.

---

## Decision guide

| Scenario | Tool |
|----------|------|
| Direct parent and child | Props and emits |
| Ancestor and several descendants | Provide and inject |
| Application-wide state | Store |

---

## General rule

> Use props for direct relationships and provide/inject when a dependency belongs to an entire subtree context.
