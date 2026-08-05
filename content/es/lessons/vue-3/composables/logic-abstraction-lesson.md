---
documentId: logic-abstraction-lesson
title: Abstracción de lógica con composables
level: basic
description: Aprende a extraer responsabilidades, definir entradas explícitas y crear APIs reutilizables sin abstraer antes de tiempo.
---

## Abstraer lógica

Abstraer consiste en identificar una responsabilidad y ofrecer una forma más simple de utilizarla. En Vue, un composable puede ocultar los detalles de una operación reactiva detrás de una API orientada a su consumidor.

El objetivo no es mover código para reducir el tamaño de un componente. Una extracción es útil cuando hace más clara la intención, permite variar una implementación o evita repetir una responsabilidad.

---

## Encontrar una responsabilidad

Antes de extraer código, intenta describir qué hace como una capacidad independiente:

- Filtrar productos a partir de una búsqueda.
- Paginar una colección.
- Cargar un recurso asíncrono.
- Validar los campos de un formulario.

“Manejar todo el catálogo” sigue siendo demasiado amplio. `useProductSearch` comunica un límite más concreto que `useCatalogStuff`.

---

## Extracción incremental

Un componente puede comenzar con lógica local perfectamente válida.

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

Cuando la búsqueda adquiere reglas propias o aparece en otra vista, podemos extraer esa responsabilidad sin cambiar la interfaz.

---

## Entradas explícitas

Una abstracción resulta más reutilizable cuando recibe lo que necesita en lugar de importar dependencias ocultas.

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

El composable no decide de dónde vienen los productos ni cómo se muestran. Recibe una fuente reactiva y se ocupa únicamente de buscar.

---

## Una API orientada al uso

La API pública debería describir lo que el consumidor puede hacer:

- `query` representa la entrada actual.
- `filteredProducts` comunica un resultado derivado.
- `clearSearch` expresa una acción completa.

No es necesario exponer cada helper, cache o valor intermedio. Cuantos más detalles internos conozca un componente, más difícil será cambiar la implementación sin romperlo.

```vue
<script setup lang="ts">
const products = ref([]);
const { query, filteredProducts, clearSearch } = useProductSearch(products);
</script>
```

---

## Dependencias intercambiables

Un composable que obtiene datos puede recibir la operación externa como argumento. Así no queda unido a `fetch`, una URL o un servicio específico.

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

La aplicación puede entregar un servicio real y los tests una función controlada. La abstracción conserva su responsabilidad sin conocer la infraestructura.

---

## Componer composables

Una funcionalidad compleja no necesita convertirse en un composable gigante. Varias capacidades pequeñas pueden colaborar.

```ts
const { products, load } = useProducts(productService.list);
const search = useProductSearch(products);
const pagination = usePagination(search.filteredProducts, 12);
```

Cada pieza mantiene un contrato concreto. El componente o un composable de nivel superior puede orquestarlas según el caso de uso.

---

## El costo de abstraer

Cada abstracción añade un nombre, un archivo, una API y un salto adicional durante la lectura. Extraer lógica demasiado pronto puede producir:

- Composables genéricos cuyo propósito no está claro.
- Parámetros y opciones que ningún consumidor necesita todavía.
- Contratos difíciles de cambiar porque intentan anticipar casos futuros.
- Lógica fragmentada entre demasiados archivos pequeños.

La duplicación puede ser una señal, pero no es una fórmula rígida. Una responsabilidad compleja usada una sola vez también puede merecer una extracción; dos fragmentos parecidos pueden evolucionar en direcciones distintas.

---

## Probar el contrato

Una buena abstracción puede probarse a través de su API pública.

```ts
const products = ref([
  { id: 1, name: "Keyboard" },
  { id: 2, name: "Monitor" },
]);
const { query, filteredProducts } = useProductSearch(products);

query.value = "key";

expect(filteredProducts.value).toEqual([{ id: 1, name: "Keyboard" }]);
```

El test no necesita conocer helpers internos ni montar la interfaz. Si la implementación cambia y el contrato se conserva, el consumidor continúa funcionando.

---

## Guía de decisión

| Pregunta | Señal favorable |
| --- | --- |
| ¿La lógica tiene una responsabilidad reconocible? | Puede recibir un nombre específico |
| ¿Sus dependencias pueden expresarse como entradas? | No necesita importar contexto oculto |
| ¿La API simplifica al consumidor? | Expone menos conceptos que la implementación |
| ¿Puede evolucionar sin conocer la UI? | No depende de markup o estilos |
| ¿La extracción reduce el costo de cambio? | Centraliza reglas que deberían evolucionar juntas |

---

## Regla general

> Abstrae una responsabilidad, no un conjunto accidental de líneas. Define entradas explícitas y una API pequeña cuando la extracción reduzca lo que el consumidor necesita comprender.
