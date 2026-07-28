<script setup>
import { inject } from "vue";

// TODO: inject "theme" with "light" as its fallback value.
</script>

<template>
  <!-- Please keep data-testid: the tests use it to validate your solution. -->
  <p data-testid="theme-status" class="status">Current theme: {{ theme }}</p>
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
