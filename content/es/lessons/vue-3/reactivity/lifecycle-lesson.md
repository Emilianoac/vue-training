---
documentId: lifecycle-lesson
title: Reactividad y Ciclo de Vida
level: basic
description: Comprende cómo el sistema reactivo de Vue se vincula al ciclo de vida del componente, y aprende a inicializar y limpiar estado reactivo con onMounted y onUnmounted.
---

## Reactividad y Ciclo de Vida

El sistema reactivo de Vue no opera de forma aislada: está estrechamente ligado al ciclo de vida del componente. Comprender esta relación es clave para saber **cuándo** el estado reactivo está disponible, cuándo los watchers y efectos se activan, y cuándo deben limpiarse.

---

## ¿Cuándo "arranca" la reactividad?

Cuando Vue ejecuta `<script setup>`, el estado reactivo (`ref`, `reactive`, `computed`, `watch`) se **crea e inicializa inmediatamente**. Sin embargo, en ese momento el componente aún no existe en el DOM.

```vue
<script setup>
import { ref } from "vue";

// ✅ El estado reactivo se crea aquí, antes del DOM
const count = ref(0);
</script>
```

Esto significa que no puedes acceder a elementos del DOM en el nivel superior de `<script setup>`. Para eso existe `onMounted`.

---

## onMounted

`onMounted` conecta la reactividad con el DOM. Se ejecuta después de que Vue monta el componente y **sincroniza el estado reactivo inicial con la vista**. Es el primer momento en que puedes:

- Leer o escribir en elementos del DOM mediante `ref` de template.
- Cargar datos externos que alimentarán el estado reactivo.
- Inicializar librerías externas que reaccionarán a cambios de estado.

```vue
<script setup>
import { ref, onMounted } from "vue";

const users = ref([]);       // Estado reactivo vacío
const container = ref(null); // Ref al elemento del DOM

onMounted(async () => {
  // ✅ Aquí el DOM existe y el estado reactivo ya está activo
  console.log(container.value); // <div>...</div>

  const response = await fetch("/api/users");
  users.value = await response.json(); // Actualiza el estado → Vue re-renderiza
});
</script>

<template>
  <div ref="container">
    <p v-for="user in users" :key="user.id">{{ user.name }}</p>
  </div>
</template>
```

> Cuando `users.value` se actualiza dentro de `onMounted`, el sistema reactivo detecta el cambio y actualiza el DOM automáticamente.

---

## onUnmounted

`onUnmounted` sirve para limpiar efectos externos antes de que dejen residuos en la aplicacion. Cuando un componente se desmonta, Vue detiene automaticamente los watchers y efectos reactivos que creo. Sin embargo, los **efectos secundarios externos** (intervalos, event listeners, suscripciones) no son gestionados por Vue y deben limpiarse manualmente.

`onUnmounted` es el hook correcto para hacerlo:

```vue
<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const isOnline = ref(navigator.onLine);

// Handler que actualiza estado reactivo desde un evento del DOM
function handleOnline() { isOnline.value = true; }
function handleOffline() { isOnline.value = false; }

onMounted(() => {
  // Conecta eventos externos al estado reactivo
  window.addEventListener("online", handleOnline);
  window.addEventListener("offline", handleOffline);
});

onUnmounted(() => {
  // ✅ Limpia los listeners para evitar fugas de memoria
  window.removeEventListener("online", handleOnline);
  window.removeEventListener("offline", handleOffline);
});
</script>

<template>
  <p>Estado: {{ isOnline ? "Conectado" : "Sin conexión" }}</p>
</template>
```

---

## Watchers y su ciclo de vida

Los watchers creados con `watch` o `watchEffect` dentro de `<script setup>` se **detienen automáticamente** cuando el componente se desmonta. No necesitas pararlos manualmente en la mayoría de los casos.

```vue
<script setup>
import { ref, watchEffect } from "vue";

const count = ref(0);

// Este watcher se detiene solo cuando el componente se desmonta
watchEffect(() => {
  console.log("count cambió:", count.value);
});
</script>
```

Si creas un watcher **fuera** del contexto de setup (por ejemplo, dentro de un `setTimeout` o una función asíncrona), debes detenerlo manualmente usando el valor de retorno:

```vue
<script setup>
import { ref, watchEffect, onMounted, onUnmounted } from "vue";

const count = ref(0);
let stopWatcher;

onMounted(() => {
  // Watcher creado fuera del contexto de setup inicial
  stopWatcher = watchEffect(() => {
    console.log("count:", count.value);
  });
});

onUnmounted(() => {
  // Debe detenerse manualmente
  stopWatcher();
});
</script>
```

---

## Resumen

| Momento                  | Estado del sistema reactivo                                        |
|--------------------------|--------------------------------------------------------------------|
| `<script setup>` (sync)  | Refs, reactives, computed y watchers se crean y activan           |
| `onMounted`              | El DOM está disponible; los datos pueden conectarse a la vista     |
| Cambio de estado         | Vue re-renderiza automáticamente solo las partes afectadas         |
| `onUnmounted`            | Watchers y efectos de Vue se detienen; limpiar efectos externos    |

> Crea estado reactivo en el nivel superior de `<script setup>`. Conéctalo al DOM o a fuentes externas en `onMounted`. Limpia los efectos externos en `onUnmounted`.
