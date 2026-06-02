<script setup>
import { ref } from "vue";

const count = ref(0);

function increment() {
  // TODO: increase count using count.value.
}

function reset() {
  // TODO: reset count to 0 using count.value.
}
</script>

<template>
  <!-- Please do not remove data-testid attributes: the challenge tests use them to validate your solution. -->
  <section class="counter">
    <p data-testid="count" class="value">Count:</p>

    <div class="actions">
      <button
        data-testid="increment-button"
        class="btn btn-primary"
        @click="increment"
      >
        Increment
      </button>

      <button
        data-testid="reset-button"
        class="btn"
        @click="reset"
      >
        Reset
      </button>
    </div>
  </section>
</template>

<style scoped>
/* Please do not edit these styles for now: they only shape the challenge preview. */
.counter {
  max-width: 24rem;
  margin: 2.5rem auto 0;
  padding: 1.5rem;
  color: var(--card-foreground);
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  box-shadow: 0 1px 2px rgb(0 0 0 / 0.06);
}

.value {
  margin: 0;
  color: var(--foreground);
  font-size: 1.5rem;
  font-weight: 600;
}

.actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 1.5rem;
}

.btn {
  padding: 0.5rem 1rem;
  color: var(--foreground);
  font: inherit;
  font-size: 0.875rem;
  font-weight: 500;
  background: transparent;
  border: 1px solid var(--border);
  border-radius: 0.375rem;
}

.btn:hover {
  color: var(--accent-foreground);
  background: var(--accent);
}

.btn-primary {
  color: var(--primary-foreground);
  background: var(--primary);
  border-color: var(--primary);
}

.btn-primary:hover {
  opacity: 0.9;
}
</style>
