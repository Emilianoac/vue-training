---
documentId: "dont-use-v-if-and-v-for-on-the-same-element"
title: "No uses v-if y v-for en el mismo elemento"
category:
  name: "Vue"
  image:
    url: "https://res.cloudinary.com/du6pa3pa5/image/upload/v1765247921/vue-training/vue_0b0e7956d5.png"
short_description: "Esto puede generar resultados inesperados porque v-if se evalúa después de v-for.
source_url: "https://vuejs.org/guide/essentials/list.html#v-for-with-v-if"
---

Esto puede generar resultados inesperados porque `v-if` se evalúa después de `v-for`.

Si necesitas ambos, considera mover `v-if` a un elemento `<template>` envolvente alrededor del `v-for`.

---

```vue 
<!-- ❌ Esto puede causar problemas -->
<template> 
  <div v-for="item in items" v-if="item.visible">
    {{item.name}}
  </div>
</template>
```

```vue 
<!-- ✅ Mejor de esta manera -->
<template>
  <template v-for="item in items" :key="item.id">
    <div v-if="item.visible">
      {{item.name}}
    </div>
  </template>
</template>

```
