---
documentId: watchers-lesson
title: Watchers en Vue 3
level: basic
description: Aprende a reaccionar a cambios en el estado reactivo usando watch y watchEffect, manejando efectos secundarios y limpieza de recursos.
---

## ¿Qué son los watchers?

Un watcher permite ejecutar una acción cuando cambia una fuente reactiva.

A diferencia de una propiedad computada, que sirve para derivar un valor, un watcher se usa para ejecutar efectos secundarios cuando un valor cambia.

Por ejemplo, puedes usar un watcher para:

- guardar información en `localStorage`,
- hacer una petición a una API,
- ejecutar logs,
- enviar eventos de analytics,
- sincronizar datos externos con el estado del componente.

Imagina que tienes un valor reactivo llamado `question` y quieres ejecutar una acción cada vez que cambie. En lugar de hacerlo manualmente en cada parte del código donde `question` pueda cambiar, puedes observar ese valor con `watch()`.

```vue
<script setup>
import { ref, watch } from "vue";

const question = ref("");

// Se ejecuta cuando question cambia
watch(question, (newQuestion, oldQuestion) => {
  console.log(`Cambió de ${oldQuestion} a ${newQuestion}`);
});
</script>
```

---

## ¿Cómo funciona watch()?

La función `watch()` observa una fuente reactiva y ejecuta un callback cuando esa fuente cambia.

Esa fuente puede ser un `ref`, una función getter, un objeto reactivo o incluso un arreglo de varias fuentes.

A diferencia de `watchEffect()`, `watch()` requiere que indiques explícitamente qué valor quieres observar.

```vue
<script setup>
import { ref, watch } from "vue";

const count = ref(0);

watch(count, (newCount, oldCount) => {
  console.log(`Antes: ${oldCount}`);
  console.log(`Ahora: ${newCount}`);
});
</script>

<template>
  <div>
    <p>Count: {{ count }}</p>

    <button @click="count++">
      Increment
    </button>
  </div>
</template>
```

Por defecto, `watch()` es perezoso (*lazy*). Esto significa que no se ejecuta inmediatamente al crear el watcher, sino solo cuando la fuente observada cambia.

---

## watch() vs watchEffect()

Aunque ambos sirven para reaccionar a cambios reactivos, tienen diferencias importantes.

`watch()` se usa cuando quieres observar una fuente específica y tener más control sobre cuándo se ejecuta el efecto.

`watchEffect()` se usa cuando quieres que Vue detecte automáticamente las dependencias usadas dentro de la función.

### watch()

`watch()` está diseñado para reaccionar a cambios específicos del estado reactivo.

- Observa una fuente explícita.
- Se ejecuta solo cuando esa fuente cambia.
- Permite acceder al valor nuevo y al valor anterior.
- Es ideal cuando necesitas comparar cambios.
- Puede configurarse para ejecutarse inmediatamente.

```vue
<script setup>
import { ref, watch } from "vue";

const question = ref("");

watch(question, (newQuestion, oldQuestion) => {
  console.log(`Cambió de ${oldQuestion} a ${newQuestion}`);
});
</script>
```

---

### watchEffect()

`watchEffect()` está diseñado para ejecutar un efecto y detectar automáticamente qué dependencias reactivas usa.

- Se ejecuta inmediatamente.
- Rastrea dependencias automáticamente.
- Se vuelve a ejecutar cuando cambia alguna dependencia usada dentro de la función.
- No permite acceder directamente al valor anterior.
- Es útil cuando el efecto depende de varios valores reactivos.

```vue
<script setup>
import { ref, watchEffect } from "vue";

const count = ref(0);

// Se ejecuta al inicio y cada vez que count cambie
watchEffect(() => {
  console.log(`El contador actual es: ${count.value}`);
});
</script>
```

---

### Cuándo usar cada uno

| Escenario                              | ¿watch? | ¿watchEffect? | Razón |
|----------------------------------------|---------|---------------|--------|
| Observar un valor específico           | Sí      | A veces       | `watch()` permite controlar exactamente la fuente observada |
| Comparar valor nuevo y valor anterior  | Sí      | No            | `watch()` recibe `newValue` y `oldValue` |
| Ejecutar un efecto inmediatamente      | Opcional | Sí           | `watchEffect()` se ejecuta automáticamente al inicio |
| Depender de varios valores reactivos   | A veces | Sí            | `watchEffect()` detecta dependencias automáticamente |
| Hacer una petición cuando cambia un id | Sí      | A veces       | `watch()` deja claro qué cambio dispara la petición |

---

## Cleanup: limpieza de efectos

Cuando un watcher ejecuta una tarea asíncrona o crea una suscripción, es importante limpiar ese efecto antes de volver a ejecutarlo.

Esto ayuda a evitar:

- fugas de memoria,
- peticiones obsoletas,
- intervalos duplicados,
- errores por condiciones de carrera (*race conditions*).

Vue permite registrar una función de limpieza que se ejecuta antes de que el watcher vuelva a dispararse o cuando el componente se desmonta.

```vue
<script setup>
import { ref, watch } from "vue";

const id = ref(1);

watch(id, (newId, oldId, onCleanup) => {
  const controller = new AbortController();

  fetch(`/api/data/${newId}`, {
    signal: controller.signal
  });

  // Se ejecuta antes del próximo cambio de id
  onCleanup(() => {
    controller.abort();
  });
});
</script>
```

En este ejemplo, si `id` cambia antes de que la petición termine, Vue ejecuta la limpieza y cancela la petición anterior.

---

## Flush timing

Por defecto, los watchers se ejecutan antes de que el DOM del componente se actualice.

Esto significa que si intentas leer el DOM dentro de un watcher, podrías obtener un valor desactualizado.

Puedes cambiar este comportamiento usando la opción `flush`.

```vue
<script setup>
import { ref, watch } from "vue";

const count = ref(0);

watch(
  count,
  () => {
    console.log("El DOM ya fue actualizado");
  },
  {
    flush: "post"
  }
);
</script>
```

Opciones principales:

- **`pre`:** valor por defecto. Ejecuta el watcher antes de que el DOM se actualice.
- **`post`:** ejecuta el watcher después de que el DOM se actualice.
- **`sync`:** ejecuta el watcher inmediatamente de forma síncrona. Debe usarse con precaución.

También puedes usar `watchPostEffect()` cuando necesites que el efecto se ejecute después de la actualización del DOM.

```vue
<script setup>
import { watchPostEffect } from "vue";

watchPostEffect(() => {
  // El DOM ya fue actualizado
});
</script>
```

---

## Watchers vs computed

Aunque ambos usan el sistema de reactividad de Vue, tienen propósitos distintos.

Las propiedades computadas sirven para calcular valores derivados. Los watchers sirven para ejecutar efectos secundarios cuando algo cambia.

| Escenario                       | ¿Computed? | ¿Watcher? | Razón |
|---------------------------------|------------|-----------|--------|
| Filtrar una lista para mostrarla | Sí         | No        | Es un valor derivado para el template |
| Calcular un total                | Sí         | No        | El resultado depende de estado reactivo |
| Guardar cambios en localStorage  | No         | Sí        | Es un efecto secundario |
| Hacer una petición a una API     | No         | Sí        | Es una acción externa |
| Enviar eventos de analytics      | No         | Sí        | No produce un valor para mostrar |

---

## Reglas para usar watchers

- **Usa computed cuando necesites derivar valores:** si el resultado se muestra en el template o se calcula a partir de otros datos, normalmente debe ser una propiedad computada.
- **Usa watchers para efectos secundarios:** peticiones HTTP, `localStorage`, logs, analytics o sincronización con APIs externas.
- **Evita modificar la misma fuente observada:** cambiar dentro del watcher el mismo valor que estás observando puede causar ciclos o comportamiento difícil de entender.
- **Limpia efectos asíncronos:** si creas peticiones, intervalos o suscripciones, usa cleanup para evitar efectos obsoletos.
- **Prefiere watch cuando necesites control:** si necesitas `oldValue`, observar una fuente específica o configurar opciones, usa `watch()`.

---

## Ejemplo de implementación

```vue
<script setup>
import { ref, watch } from "vue";

const search = ref("");
const results = ref([]);
const loading = ref(false);

watch(search, async (newSearch, oldSearch, onCleanup) => {
  if (!newSearch) {
    results.value = [];
    return;
  }

  const controller = new AbortController();

  // Limpia la petición anterior si el search cambia antes de que termine
  onCleanup(() => {
    controller.abort();
  });

  loading.value = true;

  try {
    const response = await fetch(`/api/search?q=${newSearch}`, {
      signal: controller.signal
    });

    results.value = await response.json();
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div>
    <input
      v-model="search"
      placeholder="Search..."
    />

    <p v-if="loading">
      Loading...
    </p>

    <ul>
      <li
        v-for="result in results"
        :key="result.id"
      >
        {{ result.name }}
      </li>
    </ul>
  </div>
</template>
```
