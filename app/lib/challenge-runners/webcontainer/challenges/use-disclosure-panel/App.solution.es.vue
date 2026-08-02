<script setup>
import { useDisclosure } from "./useDisclosure";

const { isOpen, open, close, toggle } = useDisclosure();
</script>

<template>
  <!-- Por favor conserva los atributos data-testid: los tests los usan para validar tu solución. -->
  <main class="disclosure-card">
    <span class="eyebrow">Detalles del curso</span>
    <div class="heading-row">
      <div>
        <h1>Composition API</h1>
        <p>Organiza lógica reactiva en funciones reutilizables.</p>
      </div>
      <button data-testid="toggle-button" class="btn primary" type="button" @click="toggle">
        {{ isOpen ? "Ocultar" : "Mostrar" }}
      </button>
    </div>

    <section v-show="isOpen" data-testid="details-panel" class="details-panel">
      <strong>Lo que practicarás</strong>
      <p>Estado reactivo, una API explícita y separación entre lógica e interfaz.</p>
      <button data-testid="close-button" class="btn" type="button" @click="close">
        Cerrar panel
      </button>
    </section>

    <button data-testid="open-button" class="text-button" type="button" @click="open">
      Abrir directamente
    </button>
  </main>
</template>

<style scoped>
.disclosure-card {
  display: grid;
  gap: 1rem;
  width: min(100% - 2rem, 40rem);
  margin: min(12vh, 5rem) auto;
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
.heading-row {
  display: flex;
  gap: 1rem;
  align-items: start;
  justify-content: space-between;
}
h1,
p {
  margin: 0;
}
.heading-row p,
.details-panel p {
  margin-top: 0.35rem;
  color: var(--muted-foreground);
}
.details-panel {
  padding: 1rem;
  background: var(--background);
  border: 1px solid var(--border);
  border-radius: 0.375rem;
}
.btn,
.text-button {
  padding: 0.55rem 0.8rem;
  color: var(--foreground);
  font: inherit;
  font-weight: 600;
  background: var(--background);
  border: 1px solid var(--border);
  border-radius: 0.375rem;
  cursor: pointer;
}
.btn.primary {
  color: var(--primary-foreground);
  background: var(--primary);
  border-color: var(--primary);
}
.details-panel .btn {
  margin-top: 1rem;
}
.text-button {
  width: fit-content;
  padding: 0;
  color: var(--muted-foreground);
  background: transparent;
  border: 0;
}
@media (max-width: 32rem) {
  .heading-row {
    flex-direction: column;
  }
}
</style>
