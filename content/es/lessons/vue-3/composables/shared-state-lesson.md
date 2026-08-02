---
documentId: shared-state-lesson
title: Estado compartido con composables
level: basic
description: Aprende cómo la ubicación del estado determina si cada consumidor recibe una instancia aislada o comparte una única fuente reactiva.
---

## Alcance del estado

Al crear un composable, la ubicación de un `ref` o un objeto `reactive` determina quién puede observarlo y cuánto tiempo permanece activo.

El estado puede pertenecer a cada consumidor o vivir en el módulo para ser compartido. Ninguna opción es mejor en todos los casos: la elección depende de si los consumidores deben mantenerse sincronizados.

---

## Estado por instancia

Cuando el estado se declara dentro del composable, cada llamada crea refs nuevos.

```ts
import { ref } from "vue";

export function useDisclosure() {
  const isOpen = ref(false);

  function toggle() {
    isOpen.value = !isOpen.value;
  }

  return { isOpen, toggle };
}
```

```ts
const firstPanel = useDisclosure();
const secondPanel = useDisclosure();

firstPanel.toggle();

console.log(firstPanel.isOpen.value); // true
console.log(secondPanel.isOpen.value); // false
```

Este alcance funciona bien para formularios, paneles y cualquier estado que deba evolucionar de forma independiente en cada componente.

---

## Estado de módulo

Cuando el estado se declara fuera de la función, el módulo crea una sola referencia. Todas las llamadas al composable devuelven acceso al mismo estado.

```ts
import { readonly, ref } from "vue";

const savedLessons = ref<string[]>([]);

export function useReadingList() {
  function saveLesson(lessonId: string) {
    if (!savedLessons.value.includes(lessonId)) {
      savedLessons.value.push(lessonId);
    }
  }

  function reset() {
    savedLessons.value = [];
  }

  return {
    savedLessons: readonly(savedLessons),
    saveLesson,
    reset,
  };
}
```

Dos componentes que invoquen `useReadingList()` observarán la misma lista. Si uno guarda una lección, el otro se actualizará de forma reactiva.

---

## Una API controlada

Compartir estado no significa que todos los consumidores deban mutarlo directamente. Devolver una vista `readonly` y exponer acciones mantiene las reglas en un solo lugar.

```ts
return {
  savedLessons: readonly(savedLessons),
  saveLesson,
  reset,
};
```

Esta API impide asignaciones accidentales desde los componentes y facilita cambiar la implementación sin modificar cada consumidor.

---

## Tiempo de vida

El estado creado dentro del composable queda asociado a quienes conservan esa instancia. Cuando ya no existen referencias, puede liberarse.

El estado de módulo vive mientras el módulo permanezca cargado. Desmontar un componente consumidor no reinicia automáticamente sus valores. Esto puede ser útil para conservar una selección durante la navegación, pero también puede mantener datos más tiempo del esperado.

Una acción `reset` permite restaurar un estado conocido al cerrar sesión, abandonar una funcionalidad o preparar cada test.

---

## Estado compartido y SSR

En una aplicación cliente tradicional, un módulo cargado representa una única sesión del navegador. En renderizado del lado del servidor, el mismo módulo puede atender varias solicitudes.

Por eso, un singleton creado directamente en el scope del módulo puede filtrar estado entre usuarios si el runtime del servidor reutiliza esa instancia.

Los frameworks con SSR ofrecen mecanismos que aíslan el estado por solicitud. En Nuxt, por ejemplo, `useState` crea estado compartido e hidratable con una clave estable.

```ts
export function useReadingList() {
  const savedLessons = useState<string[]>("reading-list", () => []);

  return { savedLessons };
}
```

En una aplicación SSR, utiliza la solución de estado recomendada por el framework o una store configurada correctamente para ese entorno.

---

## Otros alcances

El scope de módulo no es la única forma de compartir estado:

- **Props y eventos** conectan componentes con una relación directa.
- **Provide e inject** comparten dependencias dentro de un subárbol concreto.
- **Un composable con estado de módulo** sincroniza consumidores de una aplicación cliente.
- **Una store** organiza estado global con más reglas, herramientas y rutas de mutación.

Elige el alcance más pequeño que incluya a todos los consumidores necesarios.

---

## Cuándo usar una store

Un composable compartido puede ser suficiente para un estado pequeño y con pocas acciones. Una store resulta más adecuada cuando aparecen:

- Varios dominios o muchas reglas de negocio.
- Numerosos lugares capaces de modificar el estado.
- Necesidades de devtools, plugins o persistencia estructurada.
- Dificultad para rastrear por qué cambió un valor.

No es necesario esperar a que el composable sea inmanejable. El cambio de herramienta puede hacerse cuando su contrato comienza a parecerse al de una store.

---

## Guía de decisión

| Necesidad | Alcance posible |
| --- | --- |
| Estado independiente por componente | Dentro del composable |
| Estado compartido en un subárbol | Provide e inject |
| Estado pequeño compartido en una SPA | Scope de módulo |
| Estado compartido en Nuxt con SSR | `useState` o una store compatible |
| Estado global con muchas reglas y herramientas | Store |

---

## Regla general

> Comienza con estado por instancia. Compártelo solo cuando varios consumidores necesiten la misma fuente de verdad y elige un mecanismo compatible con el alcance y el entorno de renderizado.
