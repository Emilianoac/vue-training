import { defineStore } from "pinia";

export type CartItem = {
  id: number;
  name: string;
  price: number;
};

export const useCartStore = defineStore("cart", {
  state: () => ({
    items: [] as CartItem[],
  }),

  getters: {
    // TODO: devuelve la cantidad de productos del carrito.
    itemCount: () => 0,
    // TODO: suma el precio de todos los productos.
    total: () => 0,
  },

  actions: {
    addItem(_item: CartItem) {
      // TODO: agrega item al arreglo items.
    },
    clearCart() {
      // TODO: vacía el carrito.
    },
  },
});
