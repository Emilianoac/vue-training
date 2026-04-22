---
id: "use-writable-computed-properties"
title: "Usa Propiedades Computadas Editables"
category:
  name: "Vue"
  image:
    url: "https://res.cloudinary.com/du6pa3pa5/image/upload/v1765247921/vue-training/vue_0b0e7956d5.png"
short_description: "Las propiedades computadas son de solo lectura por defecto, pero puedes hacerlas editables definiendo un getter y un setter."
source_url: "https://vuejs.org/guide/essentials/computed.html#writable-computed"
---

A veces necesitas una propiedad computada a la que también se le pueda asignar un valor. En lugar de pasar una función a `computed()`, puedes pasar un objeto con los métodos `get` y `set`.

Esto es extremadamente útil cuando quieres vincular un `v-model` a una propiedad que requiere una lógica de transformación o cuando trabajas con estados de Pinia que no quieres mutar directamente.

---

``` vue
<script setup>
import { ref, computed } from "vue";

const nombre = ref("Juan");
const apellido = ref("Pérez");

const nombreCompleto = computed({
  // se ejecuta al leer la propiedad
  get: () => `${nombre.value} ${apellido.value}`,
  // se ejecuta al asignar un valor (ej. v-model)
  set: (nuevoValor) => {
    const nombres = nuevoValor.split(" ");
    nombre.value = nombres[0];
    apellido.value = nombres[nombres.length - 1];
  }
});
</script>

<template>
  <input v-model="nombreCompleto" />
  <p>Nombre: {{ nombre }}</p>
  <p>Apellido: {{ apellido }}</p>
</template>
```