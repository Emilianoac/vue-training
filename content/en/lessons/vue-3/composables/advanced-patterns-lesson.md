---
documentId: advanced-patterns-lesson
title: Advanced Composable Patterns
level: basic
description: Design flexible and safe composables through reactive inputs, protected state, factories, and effect scopes.
---

## Advanced patterns

A small composable usually begins with concrete inputs and outputs. As different consumers appear, a few patterns can extend its flexibility without duplicating the implementation.

The goal is not to use more abstractions. Each pattern should solve a real variation: accepting different reactive sources, protecting state, configuring a family of composables, or controlling the lifetime of effects.

---

## Flexible reactive inputs

A consumer may have a plain value, a ref, or a getter. Vue represents these possibilities with `MaybeRefOrGetter<T>` and reads them uniformly with `toValue`.

```ts
import { computed, toValue, type MaybeRefOrGetter } from "vue";

export function useNormalizedSearch(query: MaybeRefOrGetter<string>) {
  const normalizedQuery = computed(() => toValue(query).trim().toLowerCase());

  return { normalizedQuery };
}
```

The same composable accepts different forms:

```ts
useNormalizedSearch("vue");
useNormalizedSearch(queryRef);
useNormalizedSearch(() => route.query.search?.toString() ?? "");
```

`toValue` must run inside a reactive context such as `computed` or `watch` for Vue to track refs and getters.

---

## Intentional flexibility

Accepting every possible form does not always improve an API. If an input must change reactively, requiring a `Ref<T>` may communicate the contract more clearly.

Use a flexible input when consumers genuinely hold the same data in different forms. Convenience should not hide which values participate in reactivity.

---

## Protected state

A composable can retain control of its transitions while exposing a read-only version of its state.

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

Consumers can observe `selectedId`, but only `select` and `clear` modify it. The API keeps its rules in one place.

---

## Composable factories

A factory creates composables that share a structure but receive different configuration.

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

Configuration happens once, while each call creates its own state:

```ts
const useUsers = createUseResource(userApi.list);
const useCourses = createUseResource(courseApi.list);

const userResource = useUsers();
const courseResource = useCourses();
```

A factory is useful when real variations already share one contract. Creating one for a single case usually adds a layer without a benefit.

---

## Dependency contexts

When several composables need the same group of services, a factory can capture an explicit context.

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

This avoids repeating long argument lists without making dependencies implicit. The object still has a visible contract and can be replaced in tests.

---

## Composing capabilities

A higher-level composable can coordinate smaller APIs for a concrete use case.

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

The orchestrator exposes an API designed for the catalog. It does not need to return every internal detail from the composables it coordinates.

---

## Scope-aware cleanup

`onScopeDispose` associates cleanup with the active reactive scope. It works inside component `setup` and inside a manually created `effectScope`.

```ts
import { onScopeDispose } from "vue";

export function usePolling(callback: () => void, delay = 5_000) {
  const intervalId = window.setInterval(callback, delay);

  onScopeDispose(() => {
    window.clearInterval(intervalId);
  });
}
```

This pattern is useful for composables that create watchers, intervals, or subscriptions and may run outside a particular component.

---

## Choosing a pattern

| Need | Pattern |
| --- | --- |
| Accept a value, ref, or getter | `MaybeRefOrGetter` with `toValue` |
| Prevent external mutation | `readonly` with explicit actions |
| Create variations of one API | Composable factory |
| Share a group of services | Typed dependency context |
| Coordinate focused capabilities | Higher-level composable |
| Clean up effects with their owner | `onScopeDispose` |

---

## The cost of sophistication

Every pattern adds concepts the team must recognize. Avoid:

- Flexible inputs that make the contract ambiguous.
- Factories with only one variation.
- Context objects that collect every service in the application.
- Orchestrator composables that expose every internal detail.
- Effects whose owning scope is unclear.

Start with a direct API and adopt these patterns when a concrete need makes their benefit visible.

---

## General rule

> Use advanced patterns to express real variations and boundaries. The best API is not the most flexible one, but the one that makes its state, dependencies, and effect lifetime explicit.
