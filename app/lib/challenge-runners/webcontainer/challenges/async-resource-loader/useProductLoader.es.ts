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
    // TODO: usa loadProducts para obtener los productos.
    // Mientras espera, actualiza loading y limpia cualquier error anterior.
    // Si la carga falla, muestra "No se pudieron cargar los productos." en error.
  }

  return {
    products,
    loading,
    error,
    load,
  };
}
