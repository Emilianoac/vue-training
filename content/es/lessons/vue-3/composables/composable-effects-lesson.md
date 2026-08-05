---
documentId: composable-effects-lesson
title: Efectos y ciclo de vida en composables
level: basic
description: Aprende a encapsular watchers y recursos externos dentro de composables, vinculándolos al ciclo de vida de cada consumidor.
---

## Efectos en composables

Un composable puede encapsular algo más que estado y acciones. También puede reaccionar a cambios, registrar listeners, iniciar timers o ejecutar peticiones.

Estas operaciones producen **efectos** fuera del cálculo inmediato de una función. Para que sean predecibles, debemos decidir cuándo comienzan, qué consumidor los posee y cómo terminan.

---

## Watchers internos

Un watcher puede permanecer junto al estado que observa, sin obligar a cada componente a repetir la misma reacción.

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

El componente consume una API de búsqueda. No necesita conocer el watcher que mantiene el historial sincronizado.

---

## Watch y watchEffect

La elección mantiene los mismos criterios dentro de un composable:

- Usa `watch` cuando la fuente debe ser explícita, necesitas valores anterior y nuevo o quieres controlar opciones como `immediate`.
- Usa `watchEffect` cuando el efecto puede descubrir sus dependencias a partir de las lecturas reactivas que realiza.

```ts
watchEffect(() => {
  document.title = `${unreadCount.value} pendientes`;
});
```

Un efecto implícito debe ser fácil de anticipar. Si modifica el documento, realiza peticiones o escribe en almacenamiento, conviene expresarlo en el nombre o la documentación del composable.

---

## Ciclo de vida del consumidor

Los hooks registrados dentro de un composable se asocian con la instancia del componente que lo invoca.

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

Cada componente consumidor registra su propio listener al montarse y elimina ese mismo listener al desmontarse.

---

## Acceso seguro al navegador

APIs como `window`, `document` y `localStorage` no existen durante el renderizado del lado del servidor. Por eso el ejemplo inicializa `width` con un valor seguro y accede a `window` dentro de `onMounted`.

```ts
const width = ref(0);

onMounted(() => {
  width.value = window.innerWidth;
});
```

Mover solo el listener a `onMounted` no basta si `window` ya fue leído al crear el `ref`.

---

## Limpieza automática y manual

Vue detiene automáticamente los watchers creados de forma síncrona durante `setup()` cuando se desmonta el componente propietario.

Sin embargo, Vue no puede limpiar recursos que pertenecen a otras APIs. Debes liberar explícitamente:

- Listeners registrados con `addEventListener`.
- Intervalos y timeouts todavía activos.
- Conexiones como WebSocket.
- Peticiones o tareas asíncronas que dejaron de ser relevantes.

La función usada para limpiar debe corresponder al mismo recurso creado durante la configuración.

---

## Trabajo asíncrono obsoleto

Si una fuente cambia antes de que termine una petición, la respuesta anterior puede llegar tarde y sobrescribir datos recientes. El callback de limpieza de `watch` permite cancelar ese trabajo.

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

La limpieza se ejecuta antes de repetir el watcher y también cuando el watcher se detiene.

---

## Efectos por consumidor

Invocar un composable con hooks de ciclo de vida desde tres componentes crea tres instancias de sus efectos. Esto es correcto cuando cada consumidor necesita su propio recurso, pero puede ser innecesario para una suscripción que debería existir una sola vez.

Antes de registrar un efecto, pregunta:

- ¿Pertenece a cada instancia o debe compartirse?
- ¿Cuándo debe comenzar?
- ¿Qué evento debe detenerlo?
- ¿Qué API necesita ver el consumidor?

Estas respuestas determinan si el efecto debe vivir en el composable, en un proveedor compartido o en una capa de estado diferente.

---

## Errores comunes

- Leer APIs del navegador antes de que el componente se monte.
- Registrar un listener sin eliminarlo con la misma función.
- Crear watchers de forma asíncrona cuando ya no pueden asociarse automáticamente al componente.
- Usar `watchEffect` cuando las dependencias y consecuencias deberían ser explícitas.
- Ocultar efectos importantes detrás de un nombre que parece una función pura.

---

## Regla general

> Mantén el efecto cerca del estado que lo necesita, vincúlalo al ciclo de vida de su propietario y limpia explícitamente todo recurso que Vue no controle.
