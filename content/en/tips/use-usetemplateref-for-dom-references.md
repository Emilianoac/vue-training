---
id: "use-usetemplateref-for-dom-references"
title: "Use useTemplateRef for DOM references"
category:
  name: "Vue"
  image:
    url: "https://res.cloudinary.com/du6pa3pa5/image/upload/v1765247921/vue-training/vue_0b0e7956d5.png"
short_description: "Introduced in Vue 3.5, useTemplateRef provides a more explicit way to handle template refs without naming conflicts."
source_url: "https://vuejs.org/api/composition-api-helpers.html#usetempl
---

Before Vue 3.5, we used a regular `ref` that matched the `ref` attribute name in the template. This often caused confusion between reactive state and DOM elements.

`useTemplateRef` makes it clear that the variable is specifically for a template element. It improves code readability and works perfectly with TypeScript.

---

````vue
<script setup>
import { useTemplateRef, onMounted } from "vue";
// The argument must match the ref attribute of the template.
const inputElement = useTemplateRef("my-input");
onMounted(() => {
  inputElement.value.focus();
});
</script>

<template>
  <input ref="my-input"/>
</template>
````