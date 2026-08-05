---
documentId: logic-abstraction-lesson
title: Logic Abstraction with Composables
level: basic
description: Learn to extract responsibilities, define explicit inputs, and create reusable APIs without abstracting too early.
---

## Abstracting logic

Abstraction means identifying a responsibility and providing a simpler way to use it. In Vue, a composable can hide the details of a reactive operation behind an API designed for its consumer.

The goal is not moving code merely to shrink a component. An extraction is useful when it clarifies intent, allows an implementation to vary, or avoids repeating a responsibility.

---

## Finding a responsibility

Before extracting code, try to describe what it does as an independent capability:

- Filter products from a search query.
- Paginate a collection.
- Load an asynchronous resource.
- Validate form fields.

“Handle the entire catalog” is still too broad. `useProductSearch` communicates a clearer boundary than `useCatalogStuff`.

---

## Incremental extraction

A component can begin with perfectly valid local logic.

```vue
<script setup lang="ts">
import { computed, ref } from "vue";

const products = ref([
  { id: 1, name: "Keyboard" },
  { id: 2, name: "Monitor" },
]);
const query = ref("");
const filteredProducts = computed(() =>
  products.value.filter((product) => product.name.toLowerCase().includes(query.value.toLowerCase())),
);
</script>
```

When search gains its own rules or appears in another view, we can extract that responsibility without changing the interface.

---

## Explicit inputs

An abstraction becomes more reusable when it receives what it needs instead of importing hidden dependencies.

```ts
import { computed, ref, type Ref } from "vue";

type Product = {
  id: number;
  name: string;
};

export function useProductSearch(products: Ref<Product[]>) {
  const query = ref("");

  const filteredProducts = computed(() => {
    const normalizedQuery = query.value.trim().toLowerCase();

    return products.value.filter((product) =>
      product.name.toLowerCase().includes(normalizedQuery),
    );
  });

  function clearSearch() {
    query.value = "";
  }

  return {
    query,
    filteredProducts,
    clearSearch,
  };
}
```

The composable does not decide where products come from or how they are displayed. It receives a reactive source and owns only search behavior.

---

## A use-oriented API

The public API should describe what consumers can do:

- `query` represents the current input.
- `filteredProducts` communicates a derived result.
- `clearSearch` expresses a complete action.

There is no need to expose every helper, cache, or intermediate value. The more internal details a component knows, the harder it becomes to change the implementation without breaking it.

```vue
<script setup lang="ts">
const products = ref([]);
const { query, filteredProducts, clearSearch } = useProductSearch(products);
</script>
```

---

## Replaceable dependencies

A data-loading composable can receive its external operation as an argument. This keeps it independent from `fetch`, a URL, or a specific service.

```ts
export function useProducts(loadProducts: () => Promise<Product[]>) {
  const products = ref<Product[]>([]);
  const loading = ref(false);

  async function load() {
    loading.value = true;

    try {
      products.value = await loadProducts();
    } finally {
      loading.value = false;
    }
  }

  return { products, loading, load };
}
```

The application can provide a real service and tests can provide a controlled function. The abstraction keeps its responsibility without knowing the infrastructure.

---

## Composing composables

A complex feature does not need to become one giant composable. Several small capabilities can collaborate.

```ts
const { products, load } = useProducts(productService.list);
const search = useProductSearch(products);
const pagination = usePagination(search.filteredProducts, 12);
```

Each piece keeps a focused contract. A component or higher-level composable can orchestrate them for a particular use case.

---

## The cost of abstraction

Every abstraction adds a name, file, API, and extra jump while reading. Extracting logic too early can produce:

- Generic composables with unclear purposes.
- Parameters and options no consumer needs yet.
- Contracts that are difficult to change because they anticipate imaginary future cases.
- Logic fragmented across too many small files.

Duplication can be a signal, but it is not a rigid formula. A complex responsibility used once may still deserve extraction; two similar fragments may evolve in different directions.

---

## Testing the contract

A good abstraction can be tested through its public API.

```ts
const products = ref([
  { id: 1, name: "Keyboard" },
  { id: 2, name: "Monitor" },
]);
const { query, filteredProducts } = useProductSearch(products);

query.value = "key";

expect(filteredProducts.value).toEqual([{ id: 1, name: "Keyboard" }]);
```

The test does not need internal helpers or a mounted interface. If the implementation changes while the contract remains stable, consumers continue to work.

---

## Decision guide

| Question | Favorable signal |
| --- | --- |
| Does the logic have a recognizable responsibility? | It can receive a specific name |
| Can its dependencies be expressed as inputs? | It does not need hidden context imports |
| Does the API simplify the consumer? | It exposes fewer concepts than the implementation |
| Can it evolve without knowing the UI? | It does not depend on markup or styles |
| Does extraction reduce the cost of change? | It centralizes rules that should evolve together |

---

## General rule

> Abstract a responsibility, not an accidental set of lines. Define explicit inputs and a small API when extraction reduces what the consumer needs to understand.
