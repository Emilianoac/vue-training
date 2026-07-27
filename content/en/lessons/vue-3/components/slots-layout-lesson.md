---
documentId: slots-layout-lesson
title: Composing Interfaces with Slots
level: basic
description: Learn to create flexible components with default, named, and scoped slots in Vue 3.
---

## Slots

Components can receive data through props, but they can also receive **content and UI structure** through slots.

A slot reserves a region inside the child component. The parent decides what content to place in that region when it uses the component.

```vue
<!-- BaseCard.vue -->
<template>
  <article class="card">
    <slot />
  </article>
</template>
```

```vue
<!-- App.vue -->
<template>
  <BaseCard>
    <h2>Profile</h2>
    <p>User information</p>
  </BaseCard>
</template>
```

`BaseCard` controls the outer structure, while the parent controls the card content.

---

## Default slot

The default slot receives content written directly between the component tags without assigning it a name.

```vue
<template>
  <BaseCard>
    <p>This content fills the default slot.</p>
  </BaseCard>
</template>
```

You can also declare fallback content inside `<slot>`. Vue displays it only when the parent does not provide content.

```vue
<template>
  <slot>
    <p>No content is available.</p>
  </slot>
</template>
```

---

## Named slots

Named slots divide a component into specific regions, such as a header, main content, and actions.

```vue
<!-- BasePanel.vue -->
<template>
  <section class="panel">
    <header>
      <slot name="header" />
    </header>

    <div>
      <slot />
    </div>

    <footer>
      <slot name="actions" />
    </footer>
  </section>
</template>
```

In the parent, `#header` and `#actions` identify the content for each region. Unnamed content continues to fill the default slot.

```vue
<template>
  <BasePanel>
    <template #header>
      <h2>Edit profile</h2>
    </template>

    <p>Update your personal information.</p>

    <template #actions>
      <button>Save</button>
      <button>Cancel</button>
    </template>
  </BasePanel>
</template>
```

The `#header` syntax is shorthand for `v-slot:header`.

---

## Scoped slots

Normally, the parent sends content to the child. A scoped slot adds the opposite flow: the child exposes data and the parent decides how to render it.

```vue
<!-- UserList.vue -->
<script setup>
const users = [
  { id: 1, name: "Ana", role: "admin" },
  { id: 2, name: "Luis", role: "editor" },
];
</script>

<template>
  <ul>
    <li v-for="user in users" :key="user.id">
      <slot name="item" :user="user">
        {{ user.name }}
      </slot>
    </li>
  </ul>
</template>
```

The parent receives `user` as a slot prop and can customize the result.

```vue
<template>
  <UserList>
    <template #item="{ user }">
      <strong>{{ user.name }}</strong>
      <span>{{ user.role }}</span>
    </template>
  </UserList>
</template>
```

The child keeps control of the list logic and data; the parent controls the presentation of each item.

---

## Composition patterns

Slots are especially useful in container components that share a structure but need to accept different content.

### Layout shell

A layout can define stable regions such as navigation, a top bar, and main content. Each view fills those regions through slots.

### Cards and panels

A base card can keep the same border, spacing, and arrangement while exposing slots for its header, content, and actions.

### Modals

A reusable modal can manage its overlay, focus, and closing behavior, while its slots receive the title, body, and footer for each use case.

---

## Props or slots

Props and slots solve different needs and can coexist in the same component.

| Need | Tool |
|------|------|
| Pass text, options, or configuration | Props |
| Insert custom content or structure | Slots |
| Expose child data to customize its rendering | Scoped slots |

A prop describes data or behavior. A slot describes what interface should appear in a region.

---

## Best practices

- Use the default slot for primary content.
- Choose names that express each region's purpose, such as `header`, `actions`, or `item`.
- Include fallback content when the component should work without custom content.
- Expose only the data the parent needs through scoped slots.
- Prefer a prop when you only need to pass a value rather than visual structure.

---

## General rule

> Props configure a component; slots let you compose its interface.
