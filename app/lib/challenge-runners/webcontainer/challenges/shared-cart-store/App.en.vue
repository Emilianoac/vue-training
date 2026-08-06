<script setup lang="ts">
import CartSummary from "./CartSummary.vue";
import ProductCatalog from "./ProductCatalog.vue";
</script>

<template>
  <main class="storefront">
    <header>
      <p class="eyebrow">Pinia Store</p>
      <h1>Build your learning path</h1>
      <p class="intro">
        Add courses from the catalog and watch another component reflect the same state.
      </p>
    </header>

    <div class="workspace">
      <ProductCatalog />
      <CartSummary />
    </div>
  </main>
</template>

<style scoped>
.storefront {
  width: min(100% - 2rem, 52rem);
  margin: 2rem auto;
  color: var(--foreground);
}

.eyebrow,
.intro {
  color: var(--muted-foreground);
}

.eyebrow {
  margin: 0;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
}

h1 {
  margin: 0.375rem 0;
  font-size: 1.75rem;
}

.intro {
  max-width: 38rem;
  margin: 0;
}

.workspace {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 1rem;
  margin-top: 1.5rem;
}

@media (max-width: 40rem) {
  .workspace {
    grid-template-columns: 1fr;
  }
}
</style>
