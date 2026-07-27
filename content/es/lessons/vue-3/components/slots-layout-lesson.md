---
documentId: slots-layout-lesson
title: Composición de interfaces con slots
level: basic
description: Aprende a crear componentes flexibles con slots por defecto, slots con nombre y scoped slots en Vue 3.
---

## Slots

Los componentes pueden recibir datos mediante props, pero también pueden recibir **contenido y estructura de interfaz** mediante slots.

Un slot reserva una región dentro del componente hijo. El componente padre decide qué contenido colocar en esa región cuando utiliza el componente.

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
    <h2>Perfil</h2>
    <p>Información del usuario</p>
  </BaseCard>
</template>
```

`BaseCard` controla la estructura exterior, mientras que el padre controla el contenido de la tarjeta.

---

## Slot por defecto

El slot por defecto recibe el contenido que el padre escribe directamente entre las etiquetas del componente, sin asignarle un nombre.

```vue
<template>
  <BaseCard>
    <p>Este contenido ocupa el slot por defecto.</p>
  </BaseCard>
</template>
```

También puedes declarar contenido de respaldo dentro de `<slot>`. Vue lo muestra solamente cuando el padre no proporciona contenido.

```vue
<template>
  <slot>
    <p>No hay contenido disponible.</p>
  </slot>
</template>
```

---

## Slots con nombre

Los slots con nombre permiten dividir un componente en regiones específicas, como encabezado, contenido principal y acciones.

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

Desde el padre, `#header` y `#actions` indican qué contenido corresponde a cada región. El contenido sin nombre continúa ocupando el slot por defecto.

```vue
<template>
  <BasePanel>
    <template #header>
      <h2>Editar perfil</h2>
    </template>

    <p>Actualiza tu información personal.</p>

    <template #actions>
      <button>Guardar</button>
      <button>Cancelar</button>
    </template>
  </BasePanel>
</template>
```

La sintaxis `#header` es la forma abreviada de `v-slot:header`.

---

## Scoped slots

Normalmente, el padre envía contenido al hijo. Un scoped slot agrega el flujo contrario: el hijo expone datos y el padre decide cómo representarlos.

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

El padre recibe `user` como una prop del slot y puede personalizar el resultado.

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

El hijo conserva la lógica y los datos de la lista; el padre controla la presentación de cada elemento.

---

## Patrones de composición

Los slots son especialmente útiles en componentes contenedores que comparten estructura, pero necesitan aceptar contenido diferente.

### Layout shell

Un layout puede definir regiones estables como navegación, barra superior y contenido principal. Cada vista completa esas regiones mediante slots.

### Tarjetas y paneles

Una tarjeta base puede mantener el mismo borde, espaciado y distribución mientras expone slots para encabezado, contenido y acciones.

### Modales

Un modal reutilizable puede encargarse de la capa, el foco y el cierre, mientras sus slots reciben el título, el cuerpo y el pie de cada caso.

---

## Props o slots

Props y slots resuelven necesidades diferentes y pueden convivir en el mismo componente.

| Necesidad | Herramienta |
|-----------|-------------|
| Pasar texto, opciones o configuración | Props |
| Insertar contenido o estructura personalizada | Slots |
| Exponer datos del hijo para personalizar su representación | Scoped slots |

Una prop describe datos o comportamiento. Un slot describe qué interfaz debe aparecer en una región.

---

## Buenas prácticas

- Usa el slot por defecto para el contenido principal.
- Elige nombres que expresen la función de cada región, como `header`, `actions` o `item`.
- Incluye contenido de respaldo cuando el componente deba funcionar sin contenido personalizado.
- Expón únicamente los datos que el padre necesita en los scoped slots.
- Prefiere una prop cuando solo necesitas pasar un valor, no una estructura visual.

---

## Regla general

> Las props configuran un componente; los slots permiten componer su interfaz.
