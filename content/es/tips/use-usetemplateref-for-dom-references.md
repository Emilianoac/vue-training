---
documentId: "use-usetemplateref-for-dom-references"
title: "Usa useTemplateRef para referencias del DOM"
category:
  name: "Vue"
  image:
    url: "https://res.cloudinary.com/du6pa3pa5/image/upload/v1765247921/vue-training/vue_0b0e7956d5.png"
short_description: "Introducido en Vue 3.5, useTemplateRef ofrece una forma más explícita de manejar referencias del template sin conflictos de nombres."
source_url: "https://vuejs.org/api/composition-api-helpers.html#usetempl
---

Antes de Vue 3.5, utilizábamos un `ref` normal que debía coincidir con el nombre del atributo `ref` en el template. Esto solía causar confusión entre el estado reactivo y los elementos del DOM.

`useTemplateRef` deja claro que la variable es específicamente para un elemento del template. Mejora la legibilidad del código y funciona perfectamente con TypeScript al evitar ambigüedades.

---

````vue
<script setup>
import { useTemplateRef, onMounted } from "vue";
// El argumento debe coincidir con el atributo ref del template
const inputElement = useTemplateRef("mi-input");
onMounted(() => {
  inputElement.value.focus();
});
</script>

<template>
  <input ref="mi-input" />
</template>
````