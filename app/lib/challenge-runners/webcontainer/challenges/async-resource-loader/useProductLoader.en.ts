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
    // TODO: use loadProducts to obtain the products.
    // While waiting, update loading and clear any previous error.
    // If loading fails, set error to "Products could not be loaded."
  }

  return {
    products,
    loading,
    error,
    load,
  };
}
