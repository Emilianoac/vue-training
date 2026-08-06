<script setup lang="ts">
import { useCartStore } from "./stores/cart";

const cart = useCartStore();

// TODO: usa storeToRefs para obtener itemCount y total sin perder reactividad.
const itemCount = 0;
const total = 0;

// TODO: obtén la action clearCart desde cart.
function clearCart() {}
</script>

<template>
  <!-- Por favor no elimines los atributos data-testid: los tests del challenge los usan para validar tu solución. -->
  <aside class="cart-summary">
    <p class="eyebrow">Tu carrito</p>
    <strong data-testid="item-count">{{ itemCount }} productos</strong>
    <p data-testid="cart-total" class="total">Total: ${{ total }}</p>
    <button data-testid="clear-cart" class="btn-secondary" @click="clearCart">
      Vaciar carrito
    </button>
  </aside>
</template>

<style scoped>
/* Por favor no edites estos estilos por ahora: solo dan forma al preview del challenge. */
.cart-summary {
  display: grid;
  align-content: start;
  gap: 0.75rem;
  min-width: 15rem;
  padding: 1.25rem;
  color: var(--card-foreground);
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 0.5rem;
}

.eyebrow,
.total {
  margin: 0;
  color: var(--muted-foreground);
}

.eyebrow {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
}

.total {
  font-size: 1.125rem;
}

.btn-secondary {
  padding: 0.625rem 0.875rem;
  color: var(--foreground);
  font: inherit;
  font-weight: 600;
  background: var(--background);
  border: 1px solid var(--border);
  border-radius: 0.375rem;
}
</style>
