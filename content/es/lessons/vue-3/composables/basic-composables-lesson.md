---
documentId: basic-composables-lesson
title: Composables básicos en Vue 3
level: basic
description: Aprende a encapsular lógica reactiva en funciones, diseñar una API clara y consumir composables desde componentes Vue.
---

## Composables

Un **composable** es una función que utiliza la Composition API para encapsular lógica con estado reactivo. Permite trasladar esa lógica fuera de un componente sin trasladar su template.

Los composables suelen utilizarse para compartir comportamiento, pero la reutilización no es su única finalidad. También pueden ayudar a organizar una responsabilidad compleja y hacer que el componente se concentre en la interfaz.

---

## Primer composable

Este composable encapsula un estado booleano y las acciones que pueden modificarlo.

```ts
// composables/useToggle.ts
import { ref } from "vue";

export function useToggle(initialValue = false) {
  const value = ref(initialValue);

  function toggle() {
    value.value = !value.value;
  }

  function setValue(nextValue: boolean) {
    value.value = nextValue;
  }

  return {
    value,
    toggle,
    setValue,
  };
}
```

La función conserva los detalles de implementación y devuelve una API pequeña: un estado reactivo y dos acciones.

---

## Consumir un composable

Un componente puede invocar el composable dentro de `<script setup>` y utilizar los valores retornados tanto en el script como en el template.

```vue
<script setup lang="ts">
import { useToggle } from "~/composables/useToggle";

const { value: isOpen, toggle } = useToggle();
</script>

<template>
  <button @click="toggle">Alternar detalles</button>
  <p v-if="isOpen">Información adicional</p>
</template>
```

Al devolver refs, la reactividad se conserva incluso después de desestructurar el resultado.

---

## Convención use

Por convención, los nombres de los composables comienzan con `use`:

- `useToggle`
- `useSearch`
- `useFormValidation`

El prefijo comunica que la función puede utilizar estado reactivo, computed properties, watchers o hooks del ciclo de vida. También facilita reconocer y buscar composables dentro del proyecto.

---

## API pública

Un composable debe exponer lo que el consumidor necesita, no cada detalle interno.

```ts
import { computed, ref } from "vue";

export function usePasswordStrength() {
  const password = ref("");

  const strength = computed(() => {
    if (password.value.length < 6) return "weak";
    if (password.value.length < 10) return "medium";
    return "strong";
  });

  return {
    password,
    strength,
  };
}
```

El cálculo queda encapsulado. El consumidor puede modificar `password` y leer `strength` sin conocer las reglas internas.

Los nombres de la API deberían expresar su función:

- Estado: `users`, `query`, `error`.
- Valores derivados: `filteredUsers`, `isValid`.
- Acciones: `load`, `reset`, `toggle`.

---

## Cuándo extraer lógica

Un composable puede ser útil cuando la lógica:

- Se repite en varios componentes.
- Tiene estado y reglas que forman una responsabilidad reconocible.
- Oculta el propósito visual del componente por su tamaño o complejidad.
- Necesita probarse con independencia de la interfaz.

No es necesario mover cada `ref` a un archivo separado. El estado visual pequeño que solo pertenece a un componente puede permanecer junto a su template.

---

## Composable y componente

| Necesidad | Herramienta |
| --- | --- |
| Renderizar estructura visual | Componente |
| Encapsular lógica reactiva | Composable |
| Compartir una interacción visual completa | Componente |
| Reutilizar estado y acciones sin imponer UI | Composable |

Ambas herramientas colaboran: el composable ofrece comportamiento y el componente decide cómo representarlo.

---

## Contexto de ejecución

Los composables que utilizan hooks de Vue deben invocarse desde `<script setup>` o desde `setup()`. Además, la llamada debe realizarse de forma síncrona durante la configuración del componente.

```vue
<script setup>
import { useToggle } from "~/composables/useToggle";

const { value, toggle } = useToggle();
</script>
```

Este contexto permite que Vue asocie watchers y hooks del ciclo de vida con la instancia activa del componente y los limpie cuando se desmonta.

---

## Errores comunes

- Devolver un objeto reactivo y desestructurarlo, perdiendo la conexión reactiva de sus propiedades.
- Exponer estado interno que ningún consumidor necesita.
- Mezclar markup o decisiones visuales dentro del composable.
- Extraer lógica diminuta sin obtener claridad ni reutilización.
- Invocar fuera de `setup()` un composable que depende del contexto del componente.

---

## Regla general

> Un composable encapsula una responsabilidad reactiva detrás de una API clara. Extráelo cuando simplifique el componente, permita reutilizar comportamiento o haga la lógica más fácil de comprender y probar.
