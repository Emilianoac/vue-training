<script setup>
import { ref } from "vue";
const name = ref("");
</script>
<template>
  <div>
    <h2>Profile</h2>
    <label for="name">Name</label
    ><input id="name" v-model="name" data-testid="profile-name" placeholder="Enter your name" />
  </div>
</template>
<style scoped>
div {
  display: grid;
  gap: 0.75rem;
}
h2 {
  margin: 0;
}
input {
  padding: 0.6rem;
  color: var(--foreground);
  background: var(--background);
  border: 1px solid var(--border);
  border-radius: 0.375rem;
}
</style>
