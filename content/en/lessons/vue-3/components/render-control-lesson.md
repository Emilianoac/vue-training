---
documentId: render-control-lesson
title: Render Control in Vue 3
level: basic
description: Learn to control UI existence, visibility, and identity with v-if, v-show, key, and dynamic components.
---

## Render control

In Vue 3, it is not only about what data changes, but also **how** and **when** the UI updates. Good render control improves performance, clarity, and user experience.

## v-if and v-show

Both directives control visibility, but they work differently.

### `v-if`

- Adds or removes nodes from the DOM.
- Has higher cost when toggled many times.
- Best when the condition changes rarely.

```vue
<template>
  <UserPanel v-if="isLoggedIn" />
</template>
```

### `v-show`

- Always keeps the node in the DOM.
- Only toggles `display: none`.
- Best when the condition changes frequently.

```vue
<template>
  <UserPanel v-show="isLoggedIn" />
</template>
```

---

## How to choose

- Use `v-if` when content is heavy and should not always exist.
- Use `v-show` for fast toggles (dropdowns, tabs, simple tooltips).

If rendering the node is expensive and it rarely appears, `v-if` is usually better.
If it appears/disappears constantly, `v-show` avoids repeated mount/unmount cycles.

---

## Key and identity

`key` uniquely identifies a node or component in the virtual tree. Vue uses that key to decide whether to reuse or replace an instance.

### Typical list usage

```vue
<template>
  <li v-for="todo in todos" :key="todo.id">
    {{ todo.text }}
  </li>
</template>
```

Without a stable `key`, Vue may reuse incorrect nodes and produce unexpected visual state.

### Force component recreation

Changing a component `key` forces Vue to destroy and create a fresh instance.

```vue
<script setup>
import { ref } from "vue";

const formVersion = ref(1);
const resetForm = () => formVersion.value++;
</script>

<template>
  <UserForm :key="formVersion" />
  <button @click="resetForm">Full reset</button>
</template>
```

This resets local state, lifecycle hooks, and internal refs.

---

## Dynamic components

Vue can switch which component is rendered at runtime with `<component :is="...">`.

```vue
<script setup>
import { ref } from "vue";
import ProfileTab from "./ProfileTab.vue";
import SecurityTab from "./SecurityTab.vue";

const currentTab = ref("profile");
const tabMap = {
  profile: ProfileTab,
  security: SecurityTab,
};
</script>

<template>
  <button @click="currentTab = 'profile'">Profile</button>
  <button @click="currentTab = 'security'">Security</button>

  <component :is="tabMap[currentTab]" />
</template>
```

This pattern is ideal for tabs, multi-step forms, configurable panels, and embedded views.

---

## KeepAlive

By default, when you switch a dynamic component, the previous instance is destroyed. If you want to keep its state, wrap it with `KeepAlive`.

```vue
<template>
  <KeepAlive>
    <component :is="tabMap[currentTab]" />
  </KeepAlive>
</template>
```

Useful when you do not want to lose inputs, scroll position, or local state across view switches.

---

## Common mistakes

- Using `v-if` for very frequent toggles, causing unnecessary rendering work.
- Using `index` as `key` in reorderable lists.
- Accidentally changing `key` and losing component state.
- Forgetting `KeepAlive` when you need to preserve state in dynamic components.

---

## Quick decision guide

| Scenario | Recommendation |
|----------|----------------|
| Show/hide with low frequency | `v-if` |
| Show/hide with high frequency | `v-show` |
| Reset internal component state | Change `key` |
| Switch views/components by state | `<component :is="...">` |
| Switch components and preserve state | `KeepAlive` + dynamic component |

---

## General rule

> Control rendering intentionally: `v-if` for existence, `v-show` for visibility, `key` for identity, and dynamic components for flexible view composition.
