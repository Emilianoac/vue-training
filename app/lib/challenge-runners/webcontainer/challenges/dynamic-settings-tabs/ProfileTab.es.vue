<script setup>
import { ref } from "vue";
const name = ref("");
</script>
<template>
  <div>
    <h2>Perfil</h2>
    <label for="name">Nombre</label
    ><input id="name" v-model="name" data-testid="profile-name" placeholder="Escribe tu nombre" />
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
