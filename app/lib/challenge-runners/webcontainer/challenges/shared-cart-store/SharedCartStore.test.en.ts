import { createPinia, setActivePinia } from "pinia";
import { mount } from "@vue/test-utils";
import { beforeEach, describe, expect, it } from "vitest";
// @ts-expect-error Virtual file mounted by the challenge runner.
import cartSource from "./stores/cart?raw";
// @ts-expect-error Virtual file mounted by the challenge runner.
import summarySource from "./CartSummary.vue?raw";
// @ts-expect-error Virtual file mounted by the challenge runner.
import App from "./App.vue";
// @ts-expect-error Virtual file mounted by the challenge runner.
import { useCartStore } from "./stores/cart";

describe("shared cart with Pinia", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("defines a cart store with Pinia", () => {
    expect(cartSource).toMatch(/defineStore\s*\(\s*["']cart["']/);
  });

  it("calculates item count and total from the products", () => {
    const cart = useCartStore();

    cart.addItem({ id: 1, name: "Vue Fundamentals", price: 29 });
    cart.addItem({ id: 2, name: "Vue Components", price: 35 });

    expect(cart.itemCount).toBe(2);
    expect(cart.total).toBe(64);
  });

  it("clears the cart through an action", () => {
    const cart = useCartStore();
    cart.addItem({ id: 1, name: "Vue Fundamentals", price: 29 });

    cart.clearCart();

    expect(cart.items).toEqual([]);
    expect(cart.itemCount).toBe(0);
  });

  it("uses storeToRefs in the summary without losing reactivity", () => {
    expect(summarySource).toContain("storeToRefs");
    expect(summarySource).toMatch(/storeToRefs\s*\(\s*cart\s*\)/);
  });

  it("shares changes between the catalog and summary", async () => {
    const wrapper = mount(App, {
      global: {
        plugins: [createPinia()],
      },
    });

    const addButtons = wrapper.findAll('[data-testid="add-product"]');
    await addButtons[0]?.trigger("click");

    expect(wrapper.get('[data-testid="item-count"]').text()).toContain("1");
    expect(wrapper.get('[data-testid="cart-total"]').text()).toContain("29");

    await wrapper.get('[data-testid="clear-cart"]').trigger("click");
    expect(wrapper.get('[data-testid="item-count"]').text()).toContain("0");
  });
});
