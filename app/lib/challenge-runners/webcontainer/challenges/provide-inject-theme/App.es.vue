<script setup>
import { provide, ref } from "vue";
import ThemeStatus from "./ThemeStatus.vue";

const theme = ref("light");

// TODO: proporciona theme usando la clave "theme".

function toggleTheme() {
  theme.value = theme.value === "light" ? "dark" : "light";
}
</script>

<template>
  <!-- Por favor conserva los atributos data-testid: los tests los usan para validar tu solución. -->
  <main class="theme-preview" :class="{ dark: theme === 'dark' }">
    <section class="theme-card">
      <span class="eyebrow">Preferencias</span>
      <h1>Tema de la interfaz</h1>
      <ThemeStatus />
      <button data-testid="toggle-theme" class="btn" type="button" @click="toggleTheme">
        Cambiar tema
      </button>
    </section>
  </main>
</template>

<style scoped>
.theme-preview {
  display: grid;
  min-height: 100vh;
  padding: 1rem;
  color: var(--foreground);
  background: var(--background);
  place-items: center;
}

.theme-preview.dark {
  --card: #18181b;
  --card-foreground: #fafafa;
  --background: #27272a;
  --foreground: #fafafa;
  --border: #3f3f46;
}

.theme-card {
  display: grid;
  gap: 1rem;
  width: min(100%, 30rem);
  padding: 1.5rem;
  color: var(--card-foreground);
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 0.5rem;
}
.eyebrow {
  color: var(--muted-foreground);
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
}
h1 {
  margin: 0;
  font-size: 1.5rem;
}
.btn {
  width: fit-content;
  padding: 0.6rem 1rem;
  color: var(--primary-foreground);
  font: inherit;
  font-weight: 600;
  background: var(--primary);
  border: 1px solid var(--primary);
  border-radius: 0.375rem;
}
</style>
