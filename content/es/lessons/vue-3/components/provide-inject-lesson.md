---
documentId: provide-inject-lesson
title: Compartir contexto con Provide e Inject
level: basic
description: Aprende a compartir valores reactivos entre ancestros y descendientes sin pasar props por cada nivel del árbol.
---

## Props drilling

Las props hacen explícita la comunicación entre un padre y un hijo. Sin embargo, un dato puede terminar atravesando varios componentes que no lo utilizan solo para llegar a un descendiente profundo.

```txt
App -> Layout -> Sidebar -> UserMenu
```

Si únicamente `UserMenu` necesita el usuario actual, obligar a `Layout` y `Sidebar` a recibir y reenviar esa prop produce **props drilling**.

---

## Provide e Inject

Vue permite que un ancestro publique una dependencia con `provide()` y que cualquier descendiente dentro de su subárbol la obtenga con `inject()`.

Los componentes intermedios no necesitan conocer ni reenviar ese valor.

```txt
App (provide) -> Layout -> Sidebar -> UserMenu (inject)
```

---

## Provide

`provide()` recibe una clave y el valor que estará disponible para los descendientes.

```vue
<script setup>
import { provide, ref } from "vue";

const theme = ref("light");

provide("theme", theme);
</script>
```

La dependencia solo está disponible dentro del subárbol del componente proveedor.

---

## Inject

Un descendiente utiliza la misma clave para obtener la dependencia.

```vue
<script setup>
import { inject } from "vue";

const theme = inject("theme");
</script>

<template>
  <p>Tema actual: {{ theme }}</p>
</template>
```

La clave debe coincidir exactamente con la utilizada en `provide()`.

---

## Valores por defecto

Cuando no existe un proveedor para la clave solicitada, `inject()` devuelve `undefined`. Puedes pasar un segundo argumento como valor de respaldo.

```js
const theme = inject("theme", "light");
```

Esto permite que un componente funcione también fuera del contexto que normalmente proporciona la dependencia.

---

## Reactividad

Si el proveedor comparte un `ref` o un objeto `reactive`, los descendientes conservan la conexión reactiva.

```vue
<script setup>
import { provide, ref } from "vue";

const theme = ref("light");

function toggleTheme() {
  theme.value = theme.value === "light" ? "dark" : "light";
}

provide("theme", theme);
</script>
```

Cuando el proveedor cambia `theme.value`, todos los descendientes que inyectaron ese ref reciben el nuevo valor.

---

## Mutaciones

Aunque un descendiente puede recibir un ref mutable, suele ser más claro que el proveedor controle cómo cambia el estado. Para ello puede proporcionar el valor junto con funciones específicas.

```js
provide("themeContext", {
  theme,
  toggleTheme,
});
```

El descendiente consume la operación sin conocer los detalles internos.

```js
const themeContext = inject("themeContext");

themeContext?.toggleTheme();
```

---

## Proveedor más cercano

Varios ancestros pueden proporcionar la misma clave. En ese caso, `inject()` utiliza el proveedor más cercano en el árbol de componentes.

Esto permite sobrescribir un contexto para una parte específica de la interfaz.

---

## Cuándo usarlo

`provide` e `inject` funcionan bien cuando una dependencia pertenece al contexto de un subárbol:

- un tema local,
- el estado de un formulario compuesto,
- la configuración de un panel,
- información compartida por varios descendientes.

---

## Cuándo evitarlo

- Para comunicación directa padre-hijo, las props y los emits son más explícitos.
- Para estado global de toda la aplicación, un store puede ofrecer mejores herramientas.
- Si solo un componente necesita el dato, crear una dependencia implícita puede añadir complejidad innecesaria.

El abuso de `inject()` también puede dificultar descubrir de dónde provienen los valores.

---

## Guía de decisión

| Escenario | Herramienta |
|-----------|-------------|
| Padre e hijo directos | Props y emits |
| Ancestro y varios descendientes | Provide e inject |
| Estado global de la aplicación | Store |

---

## Regla general

> Usa props para relaciones directas y provide/inject cuando una dependencia pertenece al contexto de todo un subárbol.
