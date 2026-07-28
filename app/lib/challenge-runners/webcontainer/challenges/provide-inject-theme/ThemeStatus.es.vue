<script setup>
import { inject } from "vue";

// TODO: inyecta "theme" con "light" como valor de respaldo.
</script>

<template>
  <!-- Por favor conserva data-testid: los tests lo usan para validar tu solución. -->
  <p data-testid="theme-status" class="status">Tema actual: {{ theme }}</p>
</template>

<style scoped>
.status {
  margin: 0;
  padding: 1rem;
  color: var(--foreground);
  font-weight: 700;
  background: var(--background);
  border: 1px solid var(--border);
  border-radius: 0.375rem;
}
</style>
