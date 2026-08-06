---
documentId: global-state-lesson
title: Estado global con Pinia
level: basic
description: Aprende a crear y consumir stores con Pinia para compartir estado, valores derivados y acciones entre componentes.
---

## Estado local y estado global

El estado local pertenece a una parte concreta de la interfaz. Por ejemplo, un `ref` que controla si un modal está abierto normalmente solo le interesa al componente que muestra ese modal.

El estado global, en cambio, necesita ser leído o modificado desde distintos lugares de la aplicación. La sesión del usuario, un carrito de compras o las preferencias generales son ejemplos habituales.

Pinia permite representar ese estado compartido mediante **stores**. Un store no está ligado al ciclo de vida de un componente específico: varios componentes pueden consumir la misma instancia y observar sus cambios.

---

## Instalar Pinia en la aplicación

Después de instalar el paquete, debes crear una instancia de Pinia y registrarla como plugin antes de montar la aplicación.

```ts
import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.mount("#app");
```

Esta instancia conecta los stores con la aplicación. En proyectos Nuxt, el módulo `@pinia/nuxt` realiza esta integración por ti.

---

## Definir un store

`defineStore()` crea una función que permite acceder a un store. Su primer argumento es un identificador único y el segundo describe su estado y comportamiento.

```ts
import { defineStore } from "pinia";

export const useCartStore = defineStore("cart", {
  state: () => ({
    items: [] as { id: number; name: string; price: number }[],
  }),
});
```

Por convención, la función comienza con `use` y termina con `Store`. El estado se declara mediante una función para que cada aplicación pueda crear su propia instancia inicial.

---

## State, getters y actions

Una Options Store se organiza alrededor de tres conceptos:

- **State:** los datos reactivos que mantiene el store.
- **Getters:** valores derivados del estado, equivalentes a propiedades computadas.
- **Actions:** métodos que agrupan operaciones sobre el store.

```ts
import { defineStore } from "pinia";

export const useCartStore = defineStore("cart", {
  state: () => ({
    items: [] as { id: number; name: string; price: number }[],
  }),

  getters: {
    itemCount: (state) => state.items.length,
    total: (state) => {
      return state.items.reduce((sum, item) => sum + item.price, 0);
    },
  },

  actions: {
    addItem(item: { id: number; name: string; price: number }) {
      this.items.push(item);
    },
    clearCart() {
      this.items = [];
    },
  },
});
```

Dentro de una action puedes acceder al store mediante `this`. Las actions también pueden ser asíncronas y coordinar peticiones u otros efectos.

---

## Consumir el store en un componente

Para usar el store, importa y ejecuta la función creada por `defineStore()` dentro de `<script setup>`.

```vue
<script setup lang="ts">
import { useCartStore } from "@/stores/cart";

const cart = useCartStore();

function addCourse() {
  cart.addItem({
    id: 1,
    name: "Vue Fundamentals",
    price: 29,
  });
}
</script>

<template>
  <button @click="addCourse">Agregar curso</button>
  <p>Productos: {{ cart.itemCount }}</p>
  <p>Total: ${{ cart.total }}</p>
</template>
```

Si otro componente ejecuta `useCartStore()`, recibe el mismo store. Cuando uno agrega un producto, todos los consumidores reflejan el nuevo estado.

---

## Mantener la reactividad al desestructurar

El objeto retornado por `useCartStore()` es reactivo. Si desestructuras directamente sus propiedades, estas pierden su conexión con el store.

```ts
const cart = useCartStore();

// Evita desestructurar state y getters de esta forma.
const { items, total } = cart;
```

Usa `storeToRefs()` para convertir el state y los getters en refs que conservan su reactividad.

```ts
import { storeToRefs } from "pinia";

const cart = useCartStore();
const { items, itemCount, total } = storeToRefs(cart);
const { addItem, clearCart } = cart;
```

Las actions pueden desestructurarse directamente porque Pinia las vincula al store.

---

## Actions y mutaciones directas

Pinia permite modificar el estado directamente:

```ts
const cart = useCartStore();

cart.items = [];
```

No necesitas crear una action para cada asignación pequeña. Aun así, una action resulta útil cuando una operación tiene un nombre propio, reúne varios cambios o representa una regla de negocio, como `addItem()` o `checkout()`.

La decisión no consiste en obedecer una restricción de Pinia, sino en mantener clara la intención del código.

---

## Store o estado local

No todo estado debe ser global. Usa un store cuando varios componentes o pantallas necesiten compartir la misma fuente de verdad.

Mantén el estado dentro del componente o de un composable local cuando solo pertenezca a una vista o deba existir como una instancia independiente por consumidor.

> Un store resuelve estado compartido. No convierte automáticamente cualquier estado en una responsabilidad global.

---

## Resumen

- `createPinia()` conecta Pinia con la aplicación.
- `defineStore()` crea una función para acceder a un store.
- El state contiene datos reactivos, los getters derivan valores y las actions agrupan operaciones.
- Todos los componentes que usan el mismo store comparten su estado.
- `storeToRefs()` conserva la reactividad al desestructurar state y getters.
- El alcance del estado determina si debe vivir en un store o permanecer local.
