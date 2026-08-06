<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useCartStore } from "./stores/cart";

const cart = useCartStore();
const { itemCount, total } = storeToRefs(cart);
const { clearCart } = cart;
</script>

<template>
  <!-- Please do not remove the data-testid attributes: the challenge tests use them to validate your solution. -->
  <aside class="cart-summary">
    <p class="eyebrow">Your cart</p>
    <strong data-testid="item-count">{{ itemCount }} items</strong>
    <p data-testid="cart-total" class="total">Total: ${{ total }}</p>
    <button data-testid="clear-cart" class="btn-secondary" @click="clearCart">
      Clear cart
    </button>
  </aside>
</template>

<style scoped>
/* Please do not edit these styles for now: they only shape the challenge preview. */
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
