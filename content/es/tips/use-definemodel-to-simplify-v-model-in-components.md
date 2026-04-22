---
id: use-definemodel-to-simplify-v-model-in-components
title: "Usa defineModel para simplificar el v-model en componentes"
category:
  name: "Vue"
  image:
    url: "https://res.cloudinary.com/du6pa3pa5/image/upload/v1765247921/vue-training/vue_0b0e7956d5.png"
short_description: "Desde Vue 3.4 puedes usar defineModel para vincular v-model de forma más simple."
source_url: "https://vuejs.org/api/sfc-script-setup.html#definem
---

Si estás usando `<script setup>`, puedes usar la función `defineModel` en el componente hijo para recibir y actualizar el valor del `v-model` automáticamente.

Esto hace tu código más limpio y fácil de mantener, especialmente cuando trabajas con formularios o inputs personalizados.

Además, `defineModel` permite nombrar múltiples modelos para manejar varios `v-model` en un mismo componente.

---

```vue [ParentComponent.vue]
<script setup>
import CustomInput from "./CustomInput.vue"; 
import { ref } from "vue"; 
const name = ref("Juan");
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
<!-- ✅ Componente padre con múltiples v-model -->
<script setup>
import CustomInput from "./CustomInput.vue"; 
import { ref } from "vue"; 
const isChecked = ref(false); 
const title = ref("Hola");
</script>

<template>
  <CustomInput v-model:checked="isChecked" v-model:title="title" />
</template>
```

```vue [CustomInput.vue]
<!-- ✅ Componente hijo con múltiples defineModel (CustomInput.vue) -->
<script setup>
const checked = defineModel("checked"); 
const title = defineModel("title");
</script>

<template>
  <input type="checkbox" v-model="checked" />
  <input type="text" v-model="title" />
</template>
```
