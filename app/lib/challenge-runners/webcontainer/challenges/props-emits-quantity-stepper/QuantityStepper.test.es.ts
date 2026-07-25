import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import source from "./QuantityStepper.vue?raw";
// @ts-expect-error Virtual file mounted by the challenge runner. Example: src/Component.vue.
import QuantityStepper from "./QuantityStepper.vue";
// @ts-expect-error Virtual file mounted by the challenge runner. Example: src/Component.vue.
import App from "./App.vue";

describe("QuantityStepper.vue", () => {
  it("declara el evento update:modelValue", () => {
    expect(source).toContain("defineEmits");
    expect(source).toContain("update:modelValue");
  });

  it("muestra el valor recibido por props", () => {
    const wrapper = mount(QuantityStepper, {
      props: {
        modelValue: 3,
      },
    });

    expect(wrapper.get('[data-testid="quantity-value"]').text()).toBe("3");
  });

  it("emite un valor mayor al presionar aumentar", async () => {
    const wrapper = mount(QuantityStepper, {
      props: {
        modelValue: 3,
      },
    });

    await wrapper.get('[data-testid="increase-button"]').trigger("click");

    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([4]);
  });

  it("emite un valor menor al presionar disminuir", async () => {
    const wrapper = mount(QuantityStepper, {
      props: {
        modelValue: 3,
      },
    });

    await wrapper.get('[data-testid="decrease-button"]').trigger("click");

    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([2]);
  });

  it("respeta el minimo y el maximo", async () => {
    const wrapper = mount(QuantityStepper, {
      props: {
        modelValue: 1,
        min: 1,
        max: 2,
      },
    });

    await wrapper.get('[data-testid="decrease-button"]').trigger("click");
    expect(wrapper.emitted("update:modelValue")).toBeUndefined();

    await wrapper.setProps({ modelValue: 2 });
    await wrapper.get('[data-testid="increase-button"]').trigger("click");
    expect(wrapper.emitted("update:modelValue")).toBeUndefined();
  });

  it("comunica el nuevo valor al componente padre", async () => {
    const wrapper = mount(App);

    await wrapper.get('[data-testid="increase-button"]').trigger("click");

    expect(wrapper.get('[data-testid="selected-quantity"]').text()).toBe("3");
  });
});
