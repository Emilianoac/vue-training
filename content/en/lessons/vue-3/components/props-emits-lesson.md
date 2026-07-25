---
documentId: props-emits-lesson
title: Basic Component Communication
level: basic
description: Learn to communicate parent and child components using typed and validated props, and emits with clear contracts.
---

## Basic Component Communication

In Vue 3, components communicate following a one-way data flow: the parent passes information to the child via **props**, and the child notifies the parent of events via **emits**. This pattern makes the data flow predictable and easy to trace.

```
Parent ──props──▶ Child
Parent ◀──emits── Child
```

---

## Props

Props are how a parent component passes data to a child component. In `<script setup>`, they are defined with `defineProps()`.

### Basic Definition with Typing

```vue
<!-- components/UserCard.vue -->
<script setup lang="ts">
const props = defineProps<{
  name: string
  age: number
  isActive?: boolean  // optional with '?'
}>()
</script>

<template>
  <div>
    <p>{{ props.name }} ({{ props.age }})</p>
    <span v-if="props.isActive">Active</span>
  </div>
</template>
```

### Props with Default Values

Using `withDefaults` you can define default values for optional props:

```vue
<script setup lang="ts">
interface Props {
  name: string
  age: number
  isActive?: boolean
  role?: string
}

const props = withDefaults(defineProps<Props>(), {
  isActive: false,
  role: "viewer",
})
</script>
```

### Usage from the Parent Component

```vue
<!-- App.vue -->
<template>
  <UserCard
    name="Emiliano"
    :age="28"
    :is-active="true"
    role="admin"
  />
</template>
```

> Props with camelCase names (`isActive`) are passed in the template as kebab-case (`is-active`).

---

## Props Validation

To validate prop values (not just their type), use the object syntax with `defineProps`:

```vue
<script setup>
defineProps({
  age: {
    type: Number,
    required: true,
    validator: (value) => value >= 0 && value <= 120,
  },
  role: {
    type: String,
    default: "viewer",
    validator: (value) => ["admin", "editor", "viewer"].includes(value),
  },
})
</script>
```

If a prop fails validation, Vue emits a warning in the console during development.

---

## Emits

Emits allow a child component to notify the parent that something happened. They are defined with `defineEmits()`.

### Definition with a Typed Contract

```vue
<!-- components/LoginForm.vue -->
<script setup lang="ts">
const emit = defineEmits<{
  submit: [email: string, password: string]
  cancel: []
}>()

function handleSubmit() {
  emit("submit", "user@example.com", "secret123")
}

function handleCancel() {
  emit("cancel")
}
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <!-- ... -->
    <button type="submit">Sign In</button>
    <button type="button" @click="handleCancel">Cancel</button>
  </form>
</template>
```

### Listening to Emits from the Parent

```vue
<!-- App.vue -->
<template>
  <LoginForm
    @submit="onLogin"
    @cancel="onCancel"
  />
</template>

<script setup lang="ts">
function onLogin(email: string, password: string) {
  console.log("Logging in with:", email)
}

function onCancel() {
  console.log("Login cancelled")
}
</script>
```

---

## Props + Emits

A very common use case is the **"controlled component"** pattern: the parent controls the state and the child requests changes via emits.

```vue
<!-- components/Counter.vue -->
<script setup lang="ts">
const props = defineProps<{ count: number }>()
const emit = defineEmits<{ change: [value: number] }>()
</script>

<template>
  <div>
    <button @click="emit('change', props.count - 1)">-</button>
    <span>{{ props.count }}</span>
    <button @click="emit('change', props.count + 1)">+</button>
  </div>
</template>
```

```vue
<!-- App.vue -->
<script setup lang="ts">
import { ref } from "vue"

const count = ref(0)
</script>

<template>
  <Counter :count="count" @change="count = $event" />
</template>
```

---

## Rules

| Concept | Direction | Purpose |
|---------|-----------|---------|
| `props` | Parent → Child | Pass data and configuration |
| `emits` | Child → Parent | Notify events or request changes |

### Rules to Follow

- **Never mutate a prop directly** in the child component. If you need to modify it, emit an event so the parent can do it.
- **Use TypeScript** to type props and emits: it generates clear contracts and compile-time errors.
- **Prefer descriptive names** for emits: `update:modelValue`, `submit`, `delete` instead of generic `click` or `change`.
