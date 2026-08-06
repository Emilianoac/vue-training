import { createPinia, setActivePinia } from "pinia";
import { mount } from "@vue/test-utils";
import { beforeEach, describe, expect, it } from "vitest";
// @ts-expect-error Archivo virtual montado por el runner del challenge.
import cartSource from "./stores/cart?raw";
// @ts-expect-error Archivo virtual montado por el runner del challenge.
import summarySource from "./CartSummary.vue?raw";
// @ts-expect-error Archivo virtual montado por el runner del challenge.
import App from "./App.vue";
// @ts-expect-error Archivo virtual montado por el runner del challenge.
import { useCartStore } from "./stores/cart";

describe("carrito compartido con Pinia", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("define un store de carrito con Pinia", () => {
    expect(cartSource).toMatch(/defineStore\s*\(\s*["']cart["']/);
  });

  it("calcula la cantidad y el total desde los productos", () => {
    const cart = useCartStore();

    cart.addItem({ id: 1, name: "Fundamentos de Vue", price: 29 });
    cart.addItem({ id: 2, name: "Componentes en Vue", price: 35 });

    expect(cart.itemCount).toBe(2);
    expect(cart.total).toBe(64);
  });

  it("vacía el carrito mediante una action", () => {
    const cart = useCartStore();
    cart.addItem({ id: 1, name: "Fundamentos de Vue", price: 29 });

    cart.clearCart();

    expect(cart.items).toEqual([]);
    expect(cart.itemCount).toBe(0);
  });

  it("usa storeToRefs en el resumen sin perder reactividad", () => {
    expect(summarySource).toContain("storeToRefs");
    expect(summarySource).toMatch(/storeToRefs\s*\(\s*cart\s*\)/);
  });

  it("comparte los cambios entre el catálogo y el resumen", async () => {
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
