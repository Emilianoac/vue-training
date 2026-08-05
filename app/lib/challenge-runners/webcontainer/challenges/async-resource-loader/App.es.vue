<script setup lang="ts">
import { useProductLoader, type Product } from "./useProductLoader";

const demoProducts: Product[] = [
  { id: 1, name: "Teclado mecánico" },
  { id: 2, name: "Monitor portátil" },
  { id: 3, name: "Soporte para notebook" },
];

async function fetchProducts() {
  await new Promise((resolve) => setTimeout(resolve, 450));
  return demoProducts;
}

const { products, loading, error, load } = useProductLoader(fetchProducts);
</script>

<template>
  <!-- Por favor conserva los atributos data-testid: los tests los usan para validar tu solución. -->
  <main class="catalog-page">
    <header class="page-heading">
      <span class="eyebrow">Catálogo</span>
      <h1>Productos destacados</h1>
      <p>La vista entrega la fuente de datos y el composable administra la carga.</p>
    </header>

    <button data-testid="load-button" class="primary-btn" type="button" :disabled="loading" @click="load">
      {{ loading ? "Cargando..." : "Cargar productos" }}
    </button>

    <p v-if="error" data-testid="error" class="error-message">{{ error }}</p>

    <ul v-if="products.length" data-testid="product-list" class="product-grid">
      <li v-for="product in products" :key="product.id" class="product-card">
        <span class="product-index">{{ String(product.id).padStart(2, "0") }}</span>
        <strong>{{ product.name }}</strong>
      </li>
    </ul>

    <p v-else-if="!loading && !error" class="empty-state">Carga el catálogo para comenzar.</p>
  </main>
</template>

<style>
/* Por favor no edites estos estilos por ahora: solo dan forma al preview del challenge. */
.catalog-page { display: grid; gap: 1.5rem; width: min(100% - 2rem, 46rem); margin: min(10vh, 4rem) auto; color: var(--foreground); }
.page-heading { display: grid; gap: 0.3rem; }
.page-heading h1, .page-heading p { margin: 0; }
.page-heading p, .empty-state { color: var(--muted-foreground); }
.eyebrow { color: var(--muted-foreground); font-size: 0.75rem; font-weight: 700; text-transform: uppercase; }
.primary-btn { width: fit-content; padding: 0.6rem 0.9rem; color: var(--primary-foreground); font: inherit; font-weight: 600; background: var(--primary); border: 1px solid var(--primary); border-radius: 0.375rem; cursor: pointer; }
.primary-btn:disabled { cursor: wait; opacity: 0.65; }
.product-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(11rem, 1fr)); gap: 0.75rem; padding: 0; margin: 0; list-style: none; }
.product-card { display: grid; gap: 1.25rem; min-height: 8rem; padding: 1rem; background: var(--card); border: 1px solid var(--border); border-radius: 0.5rem; }
.product-index { color: var(--muted-foreground); font-family: monospace; font-size: 0.75rem; }
.error-message { padding: 0.75rem; color: var(--destructive); background: var(--card); border: 1px solid var(--destructive); border-radius: 0.375rem; }
</style>
