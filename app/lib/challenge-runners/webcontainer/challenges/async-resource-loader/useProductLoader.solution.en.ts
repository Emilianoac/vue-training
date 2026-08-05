import { ref } from "vue";

export type Product = {
  id: number;
  name: string;
};

export function useProductLoader(loadProducts: () => Promise<Product[]>) {
  const products = ref<Product[]>([]);
  const loading = ref(false);
  const error = ref("");

  async function load() {
    loading.value = true;
    error.value = "";

    try {
      products.value = await loadProducts();
    } catch {
      error.value = "Products could not be loaded.";
    } finally {
      loading.value = false;
    }
  }

  return {
    products,
    loading,
    error,
    load,
  };
}
