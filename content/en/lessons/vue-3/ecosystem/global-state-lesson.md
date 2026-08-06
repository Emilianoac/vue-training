---
documentId: global-state-lesson
title: Global State with Pinia
level: basic
description: Learn to create and consume Pinia stores to share state, derived values, and actions across components.
---

## Local state and global state

Local state belongs to a specific part of the interface. For example, a `ref` that controls whether a modal is open usually matters only to the component displaying that modal.

Global state, on the other hand, needs to be read or changed from different parts of the application. The user session, a shopping cart, and general preferences are common examples.

Pinia represents this shared state through **stores**. A store is not tied to the lifecycle of one specific component: multiple components can consume the same instance and react to its changes.

---

## Installing Pinia in the application

After installing the package, create a Pinia instance and register it as a plugin before mounting the application.

```ts
import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.mount("#app");
```

This instance connects the stores to the application. In Nuxt projects, the `@pinia/nuxt` module handles this integration for you.

---

## Defining a store

`defineStore()` creates a function that provides access to a store. Its first argument is a unique identifier, and its second argument describes the store's state and behavior.

```ts
import { defineStore } from "pinia";

export const useCartStore = defineStore("cart", {
  state: () => ({
    items: [] as { id: number; name: string; price: number }[],
  }),
});
```

By convention, the function starts with `use` and ends with `Store`. State is declared with a function so each application can create its own initial instance.

---

## State, getters, and actions

An Option Store is organized around three concepts:

- **State:** the reactive data held by the store.
- **Getters:** values derived from state, equivalent to computed properties.
- **Actions:** methods that group operations on the store.

```ts
import { defineStore } from "pinia";

export const useCartStore = defineStore("cart", {
  state: () => ({
    items: [] as { id: number; name: string; price: number }[],
  }),

  getters: {
    itemCount: (state) => state.items.length,
    total: (state) => {
      return state.items.reduce((sum, item) => sum + item.price, 0);
    },
  },

  actions: {
    addItem(item: { id: number; name: string; price: number }) {
      this.items.push(item);
    },
    clearCart() {
      this.items = [];
    },
  },
});
```

Inside an action, you can access the store through `this`. Actions can also be asynchronous and coordinate requests or other effects.

---

## Using the store in a component

To use the store, import and call the function created by `defineStore()` inside `<script setup>`.

```vue
<script setup lang="ts">
import { useCartStore } from "@/stores/cart";

const cart = useCartStore();

function addCourse() {
  cart.addItem({
    id: 1,
    name: "Vue Fundamentals",
    price: 29,
  });
}
</script>

<template>
  <button @click="addCourse">Add course</button>
  <p>Items: {{ cart.itemCount }}</p>
  <p>Total: ${{ cart.total }}</p>
</template>
```

If another component calls `useCartStore()`, it receives the same store. When one component adds an item, every consumer reflects the new state.

---

## Preserving reactivity when destructuring

The object returned by `useCartStore()` is reactive. If you destructure its properties directly, they lose their connection to the store.

```ts
const cart = useCartStore();

// Avoid destructuring state and getters this way.
const { items, total } = cart;
```

Use `storeToRefs()` to turn state and getters into refs that preserve reactivity.

```ts
import { storeToRefs } from "pinia";

const cart = useCartStore();
const { items, itemCount, total } = storeToRefs(cart);
const { addItem, clearCart } = cart;
```

Actions can be destructured directly because Pinia binds them to the store.

---

## Actions and direct mutations

Pinia allows direct state mutations:

```ts
const cart = useCartStore();

cart.items = [];
```

You do not need to create an action for every small assignment. However, an action is useful when an operation has a meaningful name, groups several changes, or represents a business rule such as `addItem()` or `checkout()`.

The decision is not about satisfying a Pinia restriction. It is about keeping the code's intent clear.

---

## Store or local state

Not all state should be global. Use a store when multiple components or screens need to share the same source of truth.

Keep state inside a component or a local composable when it belongs to only one view or should exist as an independent instance for each consumer.

> A store solves shared state. It does not automatically make every piece of state a global responsibility.

---

## Summary

- `createPinia()` connects Pinia to the application.
- `defineStore()` creates a function that provides access to a store.
- State holds reactive data, getters derive values, and actions group operations.
- Every component using the same store shares its state.
- `storeToRefs()` preserves reactivity when destructuring state and getters.
- The scope of the state determines whether it belongs in a store or should remain local.
