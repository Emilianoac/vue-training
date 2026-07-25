<script setup>
import { ref } from "vue";
import QuantityStepper from "./QuantityStepper.vue";

const quantity = ref(2);
</script>

<template>
  <!-- Please keep QuantityStepper and its props: the tests use them to validate your solution. -->
  <main class="product-card">
    <div>
      <span class="eyebrow">Shopping cart</span>
      <h1>VueConf tickets</h1>
      <p class="summary">
        Selected quantity:
        <strong data-testid="selected-quantity">{{ quantity }}</strong>
      </p>
    </div>

    <QuantityStepper v-model="quantity" :min="1" :max="5" />
  </main>
</template>

<style scoped>
/* Please do not edit these styles for now: they only shape the challenge preview. */
.product-card {
  display: grid;
  gap: 1.5rem;
  width: min(100% - 2rem, 42rem);
  margin: 3rem auto;
  padding: 2rem;
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
  margin: 0.35rem 0 0;
  font-size: 1.5rem;
}

.summary {
  margin: 0.75rem 0 0;
  color: var(--muted-foreground);
}

.summary strong {
  color: var(--foreground);
}
</style>
