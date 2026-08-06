---
documentId: advanced-patterns-lesson
title: Patrones avanzados para composables
level: basic
description: Diseña composables flexibles y seguros mediante entradas reactivas, estado protegido, factories y scopes de efectos.
---

## Patrones avanzados

Un composable pequeño suele comenzar con entradas y salidas concretas. A medida que aparecen consumidores diferentes, algunos patrones permiten ampliar su flexibilidad sin duplicar la implementación.

El objetivo no es usar más abstracciones. Cada patrón debería resolver una variación real: aceptar distintas fuentes reactivas, proteger el estado, configurar una familia de composables o controlar la vida de sus efectos.

---

## Entradas reactivas flexibles

Un consumidor puede tener un valor directo, un ref o un getter. Vue representa estas posibilidades con `MaybeRefOrGetter<T>` y permite leerlas de manera uniforme con `toValue`.

```ts
import { computed, toValue, type MaybeRefOrGetter } from "vue";

export function useNormalizedSearch(query: MaybeRefOrGetter<string>) {
  const normalizedQuery = computed(() => toValue(query).trim().toLowerCase());

  return { normalizedQuery };
}
```

El mismo composable admite distintas formas de uso:

```ts
useNormalizedSearch("vue");
useNormalizedSearch(queryRef);
useNormalizedSearch(() => route.query.search?.toString() ?? "");
```

`toValue` debe ejecutarse dentro de un contexto reactivo, como `computed` o `watch`, para que Vue pueda rastrear refs y getters.

---

## Flexibilidad con intención

Aceptar todas las formas posibles no siempre mejora una API. Si una entrada debe cambiar reactivamente, exigir un `Ref<T>` puede comunicar mejor el contrato.

Usa una entrada flexible cuando los consumidores realmente dispongan del mismo dato de formas diferentes. La comodidad no debería ocultar qué valores participan en la reactividad.

---

## Estado protegido

Un composable puede conservar el control de sus transiciones y exponer una versión de solo lectura de su estado.

```ts
import { readonly, ref } from "vue";

export function useSelection() {
  const selectedId = ref<number | null>(null);

  function select(id: number) {
    selectedId.value = id;
  }

  function clear() {
    selectedId.value = null;
  }

  return {
    selectedId: readonly(selectedId),
    select,
    clear,
  };
}
```

El consumidor puede observar `selectedId`, pero solo `select` y `clear` modifican su valor. La API mantiene sus reglas en un único lugar.

---

## Factories de composables

Una factory crea composables que comparten una estructura, pero reciben una configuración diferente.

```ts
import { readonly, shallowRef } from "vue";

type Loader<T> = () => Promise<T>;

export function createUseResource<T>(loader: Loader<T>) {
  return function useResource() {
    const data = shallowRef<T>();
    const loading = shallowRef(false);

    async function load() {
      loading.value = true;

      try {
        data.value = await loader();
      } finally {
        loading.value = false;
      }
    }

    return { data, loading: readonly(loading), load };
  };
}
```

La configuración ocurre una vez y cada llamada crea su propio estado:

```ts
const useUsers = createUseResource(userApi.list);
const useCourses = createUseResource(courseApi.list);

const userResource = useUsers();
const courseResource = useCourses();
```

Una factory resulta útil cuando ya existen variaciones reales sobre un mismo contrato. Crear una para un único caso suele añadir una capa sin beneficio.

---

## Contextos de dependencias

Si varios composables necesitan el mismo conjunto de servicios, una factory puede capturar un contexto explícito.

```ts
type AppServices = {
  api: UserApi;
  logger: Logger;
};

export function createUserComposables(services: AppServices) {
  function useUsers() {
    const users = ref<User[]>([]);

    async function load() {
      services.logger.info("Loading users");
      users.value = await services.api.list();
    }

    return { users, load };
  }

  return { useUsers };
}
```

Esto evita repetir muchos argumentos sin volver implícitas las dependencias. El objeto sigue teniendo un contrato visible y puede reemplazarse en tests.

---

## Componer capacidades

Un composable de nivel superior puede coordinar APIs más pequeñas para un caso de uso concreto.

```ts
export function useProductCatalog() {
  const resource = useProducts();
  const search = useProductSearch(resource.products);
  const pagination = usePagination(search.filteredProducts, 12);

  return {
    load: resource.load,
    loading: resource.loading,
    query: search.query,
    page: pagination.page,
    visibleProducts: pagination.visibleItems,
  };
}
```

El orquestador expone una API pensada para el catálogo. No necesita devolver cada detalle interno de los composables que coordina.

---

## Limpieza ligada al scope

`onScopeDispose` permite asociar la limpieza al scope reactivo activo. Funciona dentro del `setup` de un componente y también dentro de un `effectScope` creado manualmente.

```ts
import { onScopeDispose } from "vue";

export function usePolling(callback: () => void, delay = 5_000) {
  const intervalId = window.setInterval(callback, delay);

  onScopeDispose(() => {
    window.clearInterval(intervalId);
  });
}
```

Este patrón resulta útil para composables que crean watchers, intervalos o suscripciones y pueden ejecutarse fuera de un componente concreto.

---

## Elegir el patrón

| Necesidad | Patrón |
| --- | --- |
| Aceptar un valor, ref o getter | `MaybeRefOrGetter` con `toValue` |
| Evitar mutaciones externas | `readonly` y acciones explícitas |
| Crear variaciones de una misma API | Factory de composables |
| Compartir un grupo de servicios | Contexto de dependencias tipado |
| Coordinar capacidades específicas | Composable de nivel superior |
| Limpiar efectos según su propietario | `onScopeDispose` |

---

## El costo de la sofisticación

Cada patrón añade conceptos que el equipo debe reconocer. Evita:

- Entradas flexibles que vuelven ambiguo el contrato.
- Factories con una sola variante.
- Objetos de contexto que terminan reuniendo todos los servicios de la aplicación.
- Composables orquestadores que exponen cada detalle interno.
- Efectos cuyo scope propietario no está claro.

Empieza con una API directa y adopta estos patrones cuando una necesidad concreta haga visible su beneficio.

---

## Regla general

> Usa patrones avanzados para expresar variaciones y límites reales. La mejor API no es la más flexible, sino la que hace explícitos su estado, sus dependencias y el tiempo de vida de sus efectos.
