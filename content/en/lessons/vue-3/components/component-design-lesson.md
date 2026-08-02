---
documentId: component-design-lesson
title: Component Design in Vue 3
level: basic
description: Learn to distribute responsibilities, define clear contracts, and organize components that are easy to understand and maintain.
---

## Component design

Designing a component is not merely splitting an interface into small files. It also means deciding **which responsibility each piece owns**, how it communicates with others, and where its logic lives.

Good separation lets you change one part of the interface without understanding or modifying the entire system.

---

## One primary responsibility

A component is easier to understand when it has a recognizable purpose. For example, a form can collect and emit data while another component decides what to do with it.

The number of lines or props does not determine by itself whether a component is poorly designed. The important warning sign is combining responsibilities that change for different reasons.

Some warning signs are:

- Mixing data fetching, business rules, and several independent interface areas.
- Needing internal details to reuse the component.
- Breaking unrelated behavior after a small change.
- Struggling to describe its purpose in one short sentence.

---

## Container and presentational components

A common way to distribute responsibilities is to separate **orchestration** from **presentation**. This pattern is also known as smart and dumb components, although *container* and *presentational* describe their roles more clearly.

### Container component

It coordinates the state and actions of a section. It can fetch data, apply screen-level rules, and provide information to other components.

```vue
<script setup lang="ts">
import { onMounted, ref } from "vue";
import UserList from "./UserList.vue";

const users = ref([]);
const loading = ref(true);
const selectedUserId = ref<number | null>(null);

onMounted(async () => {
  users.value = await fetch("/api/users").then((response) => response.json());
  loading.value = false;
});

function openProfile(userId: number) {
  selectedUserId.value = userId;
}
</script>

<template>
  <UserList :users="users" :loading="loading" @select="openProfile" />
</template>
```

### Presentational component

It receives the required data through props and communicates interactions through events. It does not need to know where the users came from or what selecting one will do.

```vue
<script setup lang="ts">
defineProps<{
  users: Array<{ id: number; name: string }>;
  loading: boolean;
}>();

const emit = defineEmits<{
  select: [id: number];
}>();
</script>

<template>
  <p v-if="loading">Loading...</p>
  <template v-else>
    <button v-for="user in users" :key="user.id" @click="emit('select', user.id)">
      {{ user.name }}
    </button>
  </template>
</template>
```

This separation is a tool, not a requirement for every component. A small piece can manage local visual state without needing an additional container.

---

## Explicit contracts

Props and events form a component's public API. A clear contract exposes only what is needed and uses names that express intent.

```vue
<UserList :users="filteredUsers" :loading="loading" @select="openProfile" />
```

In this contract:

- `users` contains the information to display.
- `loading` describes an interface state.
- `select` communicates a user action without deciding its consequence.

A generic prop such as `data` or an event named `change` can hide too many meanings. Specific names make the component easier to use correctly.

---

## When to extract logic

Not all logic has to leave the component. Purely visual state, such as opening a menu, usually belongs to the piece that renders it.

Consider a composable when the logic:

- Is reused by multiple components.
- Has its own lifecycle or state that can be understood independently.
- Makes the component's visual purpose difficult to read.

Services can handle external details such as HTTP requests or persistence. This lets the component coordinate the interface without knowing every infrastructure detail.

```txt
Component -> composable -> service
```

Extraction should solve a concrete need. Creating a layer for every small function can also make code harder to follow.

---

## Intentional names

A name should help you anticipate the component's purpose before opening it.

- `UserProfileCard` communicates its domain and representation.
- `UserListContainer` indicates that it coordinates a user list.
- `UserFilterForm` expresses a specific interaction.
- `Widget` or `DataBox` leave their responsibility open to interpretation.

Suffixes such as `Card`, `List`, `Item`, `Form`, or `Dialog` are useful when they describe a real role, not when they are applied automatically.

---

## Feature-based organization

As an application grows, grouping related files by feature reduces the distance between pieces that usually change together.

```txt
features/
  users/
    components/
      UserListContainer.vue
      UserList.vue
      UserListItem.vue
    composables/
      useUserList.ts
    services/
      user.service.ts
```

There is no universal structure. A small application can begin with simple folders and reorganize when clear feature boundaries emerge.

---

## Decision guide

| Situation | Possible decision |
| --- | --- |
| The piece only needs local visual state | Keep it in the component |
| A section coordinates data and several visual pieces | Use a container component |
| The same interface must work in different contexts | Create a presentational component with a clear contract |
| Logic repeats or has an independent purpose | Extract it to a composable |
| The component mixes responsibilities that change separately | Split it along those responsibilities |

---

## General rule

> Split a component when doing so makes its responsibilities and contracts clearer. The goal is not to create more files, but to reduce what you need to understand to make a change.
