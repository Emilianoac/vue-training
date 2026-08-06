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
    itemCount: (state) => state.items.length,
    total: (state) => {
      return state.items.reduce((sum, item) => sum + item.price, 0);
    },
  },

  actions: {
    addItem(item: CartItem) {
      this.items.push(item);
    },
    clearCart() {
      this.items = [];
    },
  },
});
