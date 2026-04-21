---
documentId: use-definemodel-to-simplify-v-model-in-components
title: "Use defineModel to simplify v-model in components"
category:
  name: "Vue"
  image:
    url: "https://res.cloudinary.com/du6pa3pa5/image/upload/v1765247921/vue-training/vue_0b0e7956d5.png"
short_description: "Since Vue 3.4 you can use defineModel to simplify v-model bindings."
source_url: "https://vuejs.org/api/sfc-script-setup.html#definem
---

If you're using `<script setup>`, you can use the `defineModel` function in the child component to automatically receive and update the value of the `v-model` binding.

You no longer need to declare `props` or emit update events manually.
It makes your code cleaner and easier to maintain, especially when working with forms or custom inputs.

Also, `defineModel` allows you to name multiple models to handle multiple `v-model` bindings in one component.

```vue [ParentComponent.vue]
<script setup>
import CustomInput from "./CustomInput.vue"; 
import { ref } from "vue"; 
const name = ref("John");
</script>

<template>
  <CustomInput v-model="name" />
</template>
```

```vue [CustomInput.vue]
<script setup>
const model = defineModel();
</script>

<template>
  <input v-model="model" />
</template>
```

```vue [ParentComponent.vue]
<!-- ✅ Parent component with multiple v-model -->
<script setup>
import CustomInput from "./CustomInput.vue"; 
import { ref } from "vue"; 
const isChecked = ref(false); 
const title = ref("Hello");
</script>

<template>
  <CustomInput v-model:checked="isChecked" v-model:title="title" />
</template>
```

```vue [CustomInput]
<!-- ✅ Child component with multiple defineModel (CustomInput.vue) -->
<script setup>
const checked = defineModel("checked"); 
const title = defineModel("title");
</script>

<template>
  <input type="checkbox" v-model="checked" />
  <input type="text" v-model="title" />
</template>
```
