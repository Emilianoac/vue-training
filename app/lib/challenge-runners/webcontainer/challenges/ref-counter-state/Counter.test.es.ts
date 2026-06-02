import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
// @ts-expect-error Virtual file mounted by the challenge runner. Example: src/Component.vue.
import Counter from "./Counter.vue";

describe("Counter.vue", () => {
  it("muestra el contador inicial", () => {
    const wrapper = mount(Counter);

    expect(wrapper.get('[data-testid="count"]').text()).toBe("Contador: 0");
  });

  it("incrementa el contador al hacer click", async () => {
    const wrapper = mount(Counter);

    await wrapper.get('[data-testid="increment-button"]').trigger("click");

    expect(wrapper.get('[data-testid="count"]').text()).toBe("Contador: 1");
  });

  it("reinicia el contador", async () => {
    const wrapper = mount(Counter);

    await wrapper.get('[data-testid="increment-button"]').trigger("click");
    expect(wrapper.get('[data-testid="count"]').text()).toBe("Contador: 1");

    await wrapper.get('[data-testid="reset-button"]').trigger("click");

    expect(wrapper.get('[data-testid="count"]').text()).toBe("Contador: 0");
  });
});
