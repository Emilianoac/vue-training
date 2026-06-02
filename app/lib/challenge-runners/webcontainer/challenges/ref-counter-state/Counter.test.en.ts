import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
// @ts-expect-error Virtual file mounted by the challenge runner. Example: src/Component.vue.
import Counter from "./Counter.vue";

describe("Counter.vue", () => {
  it("renders the initial count", () => {
    const wrapper = mount(Counter);

    expect(wrapper.get('[data-testid="count"]').text()).toBe("Count: 0");
  });

  it("increments the count when the button is clicked", async () => {
    const wrapper = mount(Counter);

    await wrapper.get('[data-testid="increment-button"]').trigger("click");

    expect(wrapper.get('[data-testid="count"]').text()).toBe("Count: 1");
  });

  it("resets the count", async () => {
    const wrapper = mount(Counter);

    await wrapper.get('[data-testid="increment-button"]').trigger("click");
    expect(wrapper.get('[data-testid="count"]').text()).toBe("Count: 1");

    await wrapper.get('[data-testid="reset-button"]').trigger("click");

    expect(wrapper.get('[data-testid="count"]').text()).toBe("Count: 0");
  });
});
