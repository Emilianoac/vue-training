---
documentId: props-emits-lesson
title: Comunicación Básica entre Componentes
level: basic
description: Aprende a comunicar componentes padre e hijo usando props con tipado y validación, y emits con contratos claros.
---

## Comunicación Básica entre Componentes

En Vue 3, los componentes se comunican siguiendo un flujo unidireccional de datos: el padre pasa información al hijo mediante **props**, y el hijo notifica al padre de eventos mediante **emits**. Este patrón hace que el flujo de datos sea predecible y fácil de rastrear.

```
Padre ──props──▶ Hijo
Padre ◀──emits── Hijo
```

---

## Props

Las props son la forma en que un componente padre pasa datos a un componente hijo. En `<script setup>`, se definen con `defineProps()`.

### Definición básica con tipado

```vue
<!-- components/UserCard.vue -->
<script setup lang="ts">
const props = defineProps<{
  name: string
  age: number
  isActive?: boolean  // opcional con '?'
}>()
</script>

<template>
  <div>
    <p>{{ props.name }} ({{ props.age }})</p>
    <span v-if="props.isActive">Activo</span>
  </div>
</template>
```

### Props con valores por defecto

Usando `withDefaults` puedes definir valores por defecto para las props opcionales:

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

### Uso desde el componente padre

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

> Las props con nombres en camelCase (`isActive`) se pasan en el template como kebab-case (`is-active`).

---

## Validación de Props

Para validar los valores de las props (no solo su tipo), usa la sintaxis de objeto con `defineProps`:

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

Si una prop no supera la validación, Vue emite una advertencia en la consola durante el desarrollo.

---

## Emits

Los emits permiten que un componente hijo notifique al padre que algo ocurrió. Se definen con `defineEmits()`.

### Definición con contrato tipado

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
    <button type="submit">Entrar</button>
    <button type="button" @click="handleCancel">Cancelar</button>
  </form>
</template>
```

### Escuchando emits desde el padre

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
  console.log("Iniciando sesión con:", email)
}

function onCancel() {
  console.log("Login cancelado")
}
</script>
```

---

## Props + Emits

Un caso muy común es el patrón **"controlled component"**: el padre controla el estado y el hijo solicita cambios mediante emits.

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

## Reglas

| Concepto | Dirección | Propósito |
|----------|-----------|-----------|
| `props` | Padre → Hijo | Pasar datos y configuración |
| `emits` | Hijo → Padre | Notificar eventos o solicitar cambios |

### Reglas a seguir

- **Nunca mutes una prop directamente** en el componente hijo. Si necesitas modificarla, emite un evento para que el padre lo haga.
- **Usa TypeScript** para tipar props y emits: genera contratos claros y errores en tiempo de compilación.
- **Prefiere nombres descriptivos** en los emits: `update:modelValue`, `submit`, `delete` en lugar de `click` o `change` genéricos.
