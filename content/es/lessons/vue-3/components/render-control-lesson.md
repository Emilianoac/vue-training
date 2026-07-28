---
documentId: render-control-lesson
title: Control de render en Vue 3
level: basic
description: Aprende a controlar la existencia, visibilidad e identidad de la interfaz con v-if, v-show, key y componentes dinámicos.
---

## Control de render

En Vue 3, no solo importa qué datos cambian, también importa **cómo** y **cuándo** se actualiza la interfaz. Un buen control de render mejora rendimiento, claridad y experiencia de usuario.

## v-if y v-show

Ambas directivas controlan visibilidad, pero trabajan distinto.

### `v-if`

- Añade o elimina nodos del DOM.
- Tiene costo mayor al alternar muchas veces.
- Ideal cuando la condición cambia poco.

```vue
<template>
  <UserPanel v-if="isLoggedIn" />
</template>
```

### `v-show`

- Siempre mantiene el nodo en el DOM.
- Solo alterna `display: none`.
- Ideal cuando la condición cambia frecuentemente.

```vue
<template>
  <UserPanel v-show="isLoggedIn" />
</template>
```

---

## Cómo elegir

- Usa `v-if` cuando el contenido es pesado y no siempre debe existir.
- Usa `v-show` para toggles rápidos (dropdowns, tabs, tooltips simples).

Si renderizar el nodo es caro y casi nunca aparece, `v-if` suele ser mejor.
Si aparece y desaparece constantemente, `v-show` evita montajes/desmontajes repetidos.

---

## Key e identidad

`key` identifica de forma única un nodo o componente dentro del árbol virtual. Vue usa esa clave para decidir si reutiliza o reemplaza la instancia.

### Uso típico en listas

```vue
<template>
  <li v-for="todo in todos" :key="todo.id">
    {{ todo.text }}
  </li>
</template>
```

Sin una `key` estable, Vue puede reutilizar nodos incorrectamente y producir estados visuales inesperados.

### Forzar recreación de componente

Cambiar la `key` de un componente obliga a destruir y crear una instancia nueva.

```vue
<script setup>
import { ref } from "vue";

const formVersion = ref(1);
const resetForm = () => formVersion.value++;
</script>

<template>
  <UserForm :key="formVersion" />
  <button @click="resetForm">Reset completo</button>
</template>
```

Esto reinicia estado local, lifecycle hooks y refs internos.

---

## Componentes dinámicos

Vue permite cambiar qué componente se renderiza en tiempo de ejecución con `<component :is="...">`.

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
  <button @click="currentTab = 'profile'">Perfil</button>
  <button @click="currentTab = 'security'">Seguridad</button>

  <component :is="tabMap[currentTab]" />
</template>
```

Este patrón es ideal para tabs, steps de formularios, paneles configurables y vistas embebidas.

---

## KeepAlive

Por defecto, al cambiar un componente dinámico, la instancia anterior se destruye. Si quieres conservar su estado, envuélvelo con `KeepAlive`.

```vue
<template>
  <KeepAlive>
    <component :is="tabMap[currentTab]" />
  </KeepAlive>
</template>
```

Útil cuando no quieres perder inputs, scroll o estado local entre cambios de vista.

---

## Errores comunes

- Usar `v-if` para toggles muy frecuentes y generar render innecesario.
- Usar `index` como `key` en listas que se reordenan.
- Cambiar `key` accidentalmente y perder estado del componente.
- Olvidar `KeepAlive` cuando necesitas preservar estado en componentes dinámicos.

---

## Guía rápida de decisión

| Escenario | Recomendación |
|-----------|----------------|
| Mostrar/ocultar con poca frecuencia | `v-if` |
| Mostrar/ocultar con alta frecuencia | `v-show` |
| Resetear estado interno de un componente | Cambiar `key` |
| Alternar vistas/componentes por estado | `<component :is="...">` |
| Alternar componentes y conservar estado | `KeepAlive` + componente dinámico |

---

## Regla general

> Controla render con intención: `v-if` para existencia, `v-show` para visibilidad, `key` para identidad, y componentes dinámicos para composición flexible de vistas.
