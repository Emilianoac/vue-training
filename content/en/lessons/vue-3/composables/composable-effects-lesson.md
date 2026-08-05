---
documentId: composable-effects-lesson
title: Effects and Lifecycle in Composables
level: basic
description: Learn to encapsulate watchers and external resources in composables by tying them to each consumer's lifecycle.
---

## Effects in composables

A composable can encapsulate more than state and actions. It can also react to changes, register listeners, start timers, or perform requests.

These operations produce **effects** beyond a function's immediate calculation. To keep them predictable, we must decide when they start, which consumer owns them, and how they end.

---

## Internal watchers

A watcher can stay beside the state it observes, without forcing every component to repeat the same reaction.

```ts
import { ref, watch } from "vue";

export function useSearchHistory() {
  const query = ref("");
  const recentQueries = ref<string[]>([]);

  watch(query, (newQuery) => {
    const normalizedQuery = newQuery.trim();

    if (normalizedQuery && !recentQueries.value.includes(normalizedQuery)) {
      recentQueries.value.push(normalizedQuery);
    }
  });

  return {
    query,
    recentQueries,
  };
}
```

The component consumes a search API. It does not need to know about the watcher that keeps the history synchronized.

---

## Watch and watchEffect

The same selection criteria apply inside a composable:

- Use `watch` when the source must be explicit, you need previous and current values, or you want options such as `immediate`.
- Use `watchEffect` when the effect can discover its dependencies from the reactive values it reads.

```ts
watchEffect(() => {
  document.title = `${unreadCount.value} pending`;
});
```

An implicit effect should be easy to anticipate. If it modifies the document, performs requests, or writes to storage, its name or documentation should communicate that behavior.

---

## Consumer lifecycle

Hooks registered inside a composable are associated with the component instance that calls it.

```ts
import { onMounted, onUnmounted, ref } from "vue";

export function useWindowWidth() {
  const width = ref(0);

  function updateWidth() {
    width.value = window.innerWidth;
  }

  onMounted(() => {
    updateWidth();
    window.addEventListener("resize", updateWidth);
  });

  onUnmounted(() => {
    window.removeEventListener("resize", updateWidth);
  });

  return { width };
}
```

Each consuming component registers its own listener when mounted and removes that same listener when unmounted.

---

## Safe browser access

APIs such as `window`, `document`, and `localStorage` do not exist during server-side rendering. The example therefore initializes `width` with a safe value and accesses `window` inside `onMounted`.

```ts
const width = ref(0);

onMounted(() => {
  width.value = window.innerWidth;
});
```

Moving only the listener into `onMounted` is not enough if `window` was already read while creating the ref.

---

## Automatic and manual cleanup

Vue automatically stops watchers created synchronously during `setup()` when their owner component unmounts.

Vue cannot clean resources owned by other APIs. You must explicitly release:

- Listeners registered with `addEventListener`.
- Intervals and timeouts that are still active.
- Connections such as WebSocket.
- Requests or asynchronous work that is no longer relevant.

The cleanup function must correspond to the same resource created during setup.

---

## Stale asynchronous work

If a source changes before a request finishes, the previous response can arrive late and overwrite newer data. The `watch` cleanup callback can cancel that work.

```ts
import { ref, watch } from "vue";

const results = ref([]);

watch(query, async (newQuery, _oldQuery, onCleanup) => {
  const controller = new AbortController();

  onCleanup(() => controller.abort());

  const response = await fetch(`/api/search?q=${encodeURIComponent(newQuery)}`, {
    signal: controller.signal,
  });

  results.value = await response.json();
});
```

Cleanup runs before the watcher executes again and when the watcher stops.

---

## Effects per consumer

Calling a lifecycle-aware composable from three components creates three effect instances. This is correct when each consumer needs its own resource, but wasteful for a subscription that should exist only once.

Before registering an effect, ask:

- Does it belong to each instance or should it be shared?
- When should it start?
- Which event should stop it?
- Which API does the consumer need to see?

These answers determine whether the effect belongs in the composable, a shared provider, or a different state layer.

---

## Common mistakes

- Reading browser APIs before the component mounts.
- Registering a listener without removing it with the same function.
- Creating watchers asynchronously when they can no longer be associated automatically with the component.
- Using `watchEffect` when dependencies and consequences should be explicit.
- Hiding important effects behind a name that looks like a pure function.

---

## General rule

> Keep an effect close to the state that needs it, bind it to its owner's lifecycle, and explicitly clean every resource Vue does not control.
