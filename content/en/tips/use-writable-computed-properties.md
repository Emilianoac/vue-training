---
id: "use-writable-computed-properties"
title: "Use Writable Computed Properties"
category:
  name: "Vue"
  image:
    url: "https://res.cloudinary.com/du6pa3pa5/image/upload/v1765247921/vue-training/vue_0b0e7956d5.png"
short_description: "Computed properties are read-only by default, but you can create 'writable' ones by providing a getter and a setter."
source_url: "https://vuejs.org/guide/essentials/computed.html#writable-computed"
---

Sometimes you need a computed property that you can also assign a value to. Instead of passing a single function to `computed()`, pass an object with `get` and `set` methods.

This is particularly useful when you want to wrap a prop or a state from a store into a `v-model` inside a child component while maintaining the 'one-way data flow' principle.

---

``` vue
<script setup>
import { ref, computed } from "vue";

const firstName = ref("John");
const lastName = ref("Doe");

const fullName = computed({
  // executed when reading the property
  get: () => `${firstName.value} ${lastName.value}`,
  // executed when assigning a value (e.g. v-model)
  set: (newValue) => {
    const names = newValue.split(" ");
    firstName.value = names[0];
    lastName.value = names[names.length - 1];
  }
});
</script>

<template>
  <div>
    <input v-model="fullName" placeholder="Edit full name" />
    <p>First Name: {{ firstName }}</p>
    <p>Last Name: {{ lastName }}</p>
  </div>
</template>
```