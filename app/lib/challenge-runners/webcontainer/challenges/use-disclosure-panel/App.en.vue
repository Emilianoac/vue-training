<script setup>
import { ref } from "vue";
import { useDisclosure } from "./useDisclosure";

// TODO: replace this local state and these actions using the imported composable.
const isOpen = ref(false);

function open() {
  isOpen.value = true;
}

function close() {
  isOpen.value = false;
}

function toggle() {
  isOpen.value = !isOpen.value;
}
</script>

<template>
  <!-- Please keep the data-testid attributes: the tests use them to validate your solution. -->
  <main class="disclosure-card">
    <span class="eyebrow">Course details</span>
    <div class="heading-row">
      <div>
        <h1>Composition API</h1>
        <p>Organize reactive logic into reusable functions.</p>
      </div>
      <button data-testid="toggle-button" class="btn primary" type="button" @click="toggle">
        {{ isOpen ? "Hide" : "Show" }}
      </button>
    </div>

    <section v-show="isOpen" data-testid="details-panel" class="details-panel">
      <strong>What you will practice</strong>
      <p>Reactive state, an explicit API, and separation between logic and interface.</p>
      <button data-testid="close-button" class="btn" type="button" @click="close">
        Close panel
      </button>
    </section>

    <button data-testid="open-button" class="text-button" type="button" @click="open">
      Open directly
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
