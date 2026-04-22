---
id: "dont-use-v-if-and-v-for-on-the-same-element"
title: "Don't use v-if and v-for on the same element"
category:
  name: "Vue"
  image:
    url: "https://res.cloudinary.com/du6pa3pa5/image/upload/v1765247921/vue-training/vue_0b0e7956d5.png"
short_description: "This can lead to unexpected results because v-if is evaluated after v-for."
source_url: "https://vuejs.org/guide/essentials/list.html#v-for-with-v-if"
---

This can lead to unexpected results because `v-if` is evaluated after `v-for`.

If you need both, consider moving `v-if` to a wrapping `<template>` element around the `v-for`.

---


```vue
<!-- ❌ This can cause issues -->
<div v-for="item in items" v-if="item.visible">
  {{item.name}}
</div>
```

```vue
<!-- ✅ Better this way -->
<template v-for="item in items" :key="item.id">
  <div v-if="item.visible">
    {{item.name}}
  </div>
</template>
```
