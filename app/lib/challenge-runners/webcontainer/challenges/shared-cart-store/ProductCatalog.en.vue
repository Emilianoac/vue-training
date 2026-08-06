<script setup lang="ts">
import { useCartStore } from "./stores/cart";

const cart = useCartStore();
const products = [
  { id: 1, name: "Vue Fundamentals", price: 29 },
  { id: 2, name: "Vue Components", price: 35 },
  { id: 3, name: "Advanced Reactivity", price: 42 },
];
</script>

<template>
  <section>
    <p class="eyebrow">Available courses</p>
    <div class="product-list">
      <article v-for="product in products" :key="product.id" class="product">
        <div>
          <strong>{{ product.name }}</strong>
          <p>${{ product.price }}</p>
        </div>
        <button
          data-testid="add-product"
          class="btn-primary"
          @click="cart.addItem(product)"
        >
          Add
        </button>
      </article>
    </div>
  </section>
</template>

<style scoped>
.eyebrow {
  margin: 0 0 0.75rem;
  color: var(--muted-foreground);
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
}

.product-list {
  display: grid;
  gap: 0.75rem;
}

.product {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem;
  color: var(--card-foreground);
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 0.5rem;
}

.product p {
  margin: 0.25rem 0 0;
  color: var(--muted-foreground);
}

.btn-primary {
  padding: 0.625rem 0.875rem;
  color: var(--primary-foreground);
  font: inherit;
  font-weight: 600;
  background: var(--primary);
  border: 1px solid var(--primary);
  border-radius: 0.375rem;
}
</style>
