import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
// @ts-expect-error Virtual file mounted by the challenge runner. Example: src/Component.vue.
import Counter from "./Counter.vue";
// @ts-expect-error Virtual raw file mounted by the challenge runner.
import CounterSource from "./Counter.vue?raw";

describe("Counter.vue", () => {
  it("imports ref and declares the initial state", () => {
    expect(CounterSource).toMatch(/import\s*{\s*ref\s*}\s*from\s*["']vue["']/);
    expect(CounterSource).toMatch(/const\s+count\s*=\s*ref\s*\(\s*0\s*\)/);
  });

  it("implements the counter functions", () => {
    expect(CounterSource).toMatch(
      /function\s+increment\s*\([^)]*\)\s*{[^}]*count\.value\s*(?:\+\+|\+=\s*1|=\s*count\.value\s*\+\s*1)/s,
    );
    expect(CounterSource).toMatch(/function\s+reset\s*\([^)]*\)\s*{[^}]*count\.value\s*=\s*0/s);
  });

  it("renders and updates the count in the template", async () => {
    const wrapper = mount(Counter);

    expect(wrapper.get('[data-testid="count"]').text()).toBe("Count: 0");

    await wrapper.get('[data-testid="increment-button"]').trigger("click");
    expect(wrapper.get('[data-testid="count"]').text()).toBe("Count: 1");

    await wrapper.get('[data-testid="reset-button"]').trigger("click");

    expect(wrapper.get('[data-testid="count"]').text()).toBe("Count: 0");
  });
});
