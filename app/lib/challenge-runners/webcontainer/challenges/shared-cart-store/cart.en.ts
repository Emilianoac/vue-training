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
    // TODO: return the number of items in the cart.
    itemCount: () => 0,
    // TODO: add the price of every item.
    total: () => 0,
  },

  actions: {
    addItem(_item: CartItem) {
      // TODO: add item to the items array.
    },
    clearCart() {
      // TODO: empty the cart.
    },
  },
});
