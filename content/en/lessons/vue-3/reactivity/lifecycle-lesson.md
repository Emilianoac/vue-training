---
documentId: lifecycle-lesson
title: Reactivity and the Component Lifecycle
level: basic
description: Understand how Vue's reactive system ties into the component lifecycle, and learn to initialize and clean up reactive state with onMounted and onUnmounted.
---

## Reactivity and the Component Lifecycle

Vue's reactive system does not operate in isolation: it is tightly linked to the component lifecycle. Understanding this relationship is key to knowing **when** reactive state is available, when watchers and effects are activated, and when they need to be cleaned up.

---

## When Does Reactivity "Start"?

When Vue executes `<script setup>`, reactive state (`ref`, `reactive`, `computed`, `watch`) is **created and initialized immediately**. However, at that point the component does not yet exist in the DOM.

```vue
<script setup>
import { ref } from "vue";

// ✅ Reactive state is created here, before the DOM
const count = ref(0);
</script>
```

This means you cannot access DOM elements at the top level of `<script setup>`. That is what `onMounted` is for.

---

## onMounted

`onMounted` connects reactivity to the DOM. It runs after Vue mounts the component and **synchronizes the initial reactive state with the view**. It is the first moment when you can:

- Read or write to DOM elements via template `ref`.
- Fetch external data that will feed the reactive state.
- Initialize third-party libraries that will react to state changes.

```vue
<script setup>
import { ref, onMounted } from "vue";

const users = ref([]);       // Empty reactive state
const container = ref(null); // Ref to the DOM element

onMounted(async () => {
  // ✅ The DOM exists here and reactive state is already active
  console.log(container.value); // <div>...</div>

  const response = await fetch("/api/users");
  users.value = await response.json(); // Updates state → Vue re-renders
});
</script>

<template>
  <div ref="container">
    <p v-for="user in users" :key="user.id">{{ user.name }}</p>
  </div>
</template>
```

> When `users.value` is updated inside `onMounted`, the reactive system detects the change and updates the DOM automatically.

---

## onUnmounted

`onUnmounted` is used to clean up external effects before they leave leftovers in the application. When a component is unmounted, Vue automatically stops the watchers and reactive effects it created. However, **external side effects** (intervals, event listeners, subscriptions) are not managed by Vue and must be cleaned up manually.

`onUnmounted` is the right hook for this:

```vue
<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const isOnline = ref(navigator.onLine);

// Handlers that update reactive state from DOM events
function handleOnline() { isOnline.value = true; }
function handleOffline() { isOnline.value = false; }

onMounted(() => {
  // Connect external events to reactive state
  window.addEventListener("online", handleOnline);
  window.addEventListener("offline", handleOffline);
});

onUnmounted(() => {
  // ✅ Clean up listeners to prevent memory leaks
  window.removeEventListener("online", handleOnline);
  window.removeEventListener("offline", handleOffline);
});
</script>

<template>
  <p>Status: {{ isOnline ? "Online" : "Offline" }}</p>
</template>
```

---

## Watchers and Their Lifecycle

Watchers created with `watch` or `watchEffect` inside `<script setup>` **stop automatically** when the component is unmounted. You do not need to stop them manually in most cases.

```vue
<script setup>
import { ref, watchEffect } from "vue";

const count = ref(0);

// This watcher stops on its own when the component is unmounted
watchEffect(() => {
  console.log("count changed:", count.value);
});
</script>
```

If you create a watcher **outside the setup context** (for example, inside a `setTimeout` or an async function), you must stop it manually using its return value:

```vue
<script setup>
import { ref, watchEffect, onMounted, onUnmounted } from "vue";

const count = ref(0);
let stopWatcher;

onMounted(() => {
  // Watcher created outside the initial setup context
  stopWatcher = watchEffect(() => {
    console.log("count:", count.value);
  });
});

onUnmounted(() => {
  // Must be stopped manually
  stopWatcher();
});
</script>
```

---

## Summary

| Moment                   | State of the reactive system                                          |
|--------------------------|-----------------------------------------------------------------------|
| `<script setup>` (sync)  | Refs, reactives, computed and watchers are created and activated      |
| `onMounted`              | The DOM is available; data can be connected to the view               |
| State change             | Vue automatically re-renders only the affected parts                  |
| `onUnmounted`            | Vue watchers and effects stop; external side effects must be cleaned  |

> Create reactive state at the top level of `<script setup>`. Connect it to the DOM or external sources in `onMounted`. Clean up external side effects in `onUnmounted`.
