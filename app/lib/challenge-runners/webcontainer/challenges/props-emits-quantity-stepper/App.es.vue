<script setup>
import { ref } from "vue";
import QuantityStepper from "./QuantityStepper.vue";

const quantity = ref(2);
</script>

<template>
  <!-- Por favor conserva QuantityStepper y sus props: los tests los usan para validar tu solucion. -->
  <main class="product-card">
    <div>
      <span class="eyebrow">Carrito de compra</span>
      <h1>Entradas para VueConf</h1>
      <p class="summary">
        Cantidad seleccionada:
        <strong data-testid="selected-quantity">{{ quantity }}</strong>
      </p>
    </div>

    <!-- TODO: conecta quantity con QuantityStepper usando v-model. -->
    <QuantityStepper :min="1" :max="5" />
  </main>
</template>

<style scoped>
/* Por favor no edites estos estilos por ahora: solo dan forma al preview del challenge. */
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
