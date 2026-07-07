---
documentId: watchers-lesson
title: Watchers in Vue 3
level: basic
description: Learn how to react to changes in reactive state using watch and watchEffect, handling side effects and memory cleanup.
---

## Effects and Watchers
Sometimes we need to perform "side effects" in response to state changes (for example, saving to localStorage when a value changes or querying an API). For this, Vue provides us with Watchers.

---

## watch vs watchEffect
Vue offers two main ways to observe state, each with a distinct purpose:

### 1. `watch()`
It is **lazy** by default: it only runs when the observed source changes. It requires you to specify exactly what you want to watch.

- **Advantages**: Access to both the new and the previous value (oldValue).

- **Control**: You have full control over what triggers the effect.

```vue
<script setup>
import { ref, watch } from "vue";

const question = ref("");

// Only runs if 'question' changes
watch(question, (newQuestion, oldQuestion) => {
  console.log(`Changed from ${oldQuestion} to ${newQuestion}`)
});
</script>
```

### 2. `watchEffect()`
Runs **immediately** once to track its dependencies and re-runs whenever any of them change.

- **Advantages**: Less code, automatically tracks any ref or reactive used inside the function.

- **Limitation**: Does not give access to the previous value.

```vue
<script setup>
import { ref, watchEffect } from "vue";

const count = ref(0);

// Runs on mount and every time count.value changes
watchEffect(() => {
  console.log(`Current counter is: ${count.value}`)
});
</script>
```

---

## Cleanup: Cleaning up effects
When an effect performs an async task or creates a subscription (like a `setInterval`), we need to clean it up to avoid memory leaks or race condition errors.

Both functions allow registering a **cleanup** callback that runs just before the effect is triggered again or when the component is destroyed.

```vue
<script setup>
watch(id, (newId, oldId, onCleanup) => {
  const controller = new AbortController();
  
  fetch(`/api/data/${newId}`, { signal: controller.signal })

  // Runs before the next ID change
  onCleanup(() => controller.abort());
})
</script>
```

---

## Flush Timing

By default, watchers run before the DOM is updated. If you try to access a DOM element via a `ref` inside a watcher, you might get a stale value.

You can change this behavior with the `flush` option:

- `'pre'` (default): Runs before the DOM update.

- `'post'`: Runs after the DOM update (ideal for manipulating visual elements).

- `'sync'`: Runs immediately and synchronously (use with caution).

```vue
<script setup>
watch(source, callback, {
  flush: "post"
})

// Or with watchEffect:
watchPostEffect(() => { /* DOM already updated */ })
</script>
```

---

## When to use each one

| Feature                    | watch                        | watchEffect                          |
|----------------------------|------------------------------|--------------------------------------|
| Immediate execution        | No (optional)                | Yes                                  |
| Dependency tracking        | Explicit                     | Automatic                            |
| Access to oldValue         | Yes                          | No                                   |
| Main use case              | Specific state changes       | Syncing multiple state sources       |


---

## Rules for using watchers

Use **Computed Properties** whenever possible to transform data. Use **Watchers** only when you need to perform side effects that don't return a value for the template, such as logs, server calls, or analytics.
