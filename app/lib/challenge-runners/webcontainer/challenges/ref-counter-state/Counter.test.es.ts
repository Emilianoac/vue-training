import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
// @ts-expect-error Virtual file mounted by the challenge runner. Example: src/Component.vue.
import Counter from "./Counter.vue";
// @ts-expect-error Virtual raw file mounted by the challenge runner.
import CounterSource from "./Counter.vue?raw";

describe("Counter.vue", () => {
  it("importa ref y declara el estado inicial", () => {
    expect(CounterSource).toMatch(/import\s*{\s*ref\s*}\s*from\s*["']vue["']/);
    expect(CounterSource).toMatch(/const\s+count\s*=\s*ref\s*\(\s*0\s*\)/);
  });

  it("implementa las funciones del contador", () => {
    expect(CounterSource).toMatch(
      /function\s+increment\s*\([^)]*\)\s*{[^}]*count\.value\s*(?:\+\+|\+=\s*1|=\s*count\.value\s*\+\s*1)/s,
    );
    expect(CounterSource).toMatch(/function\s+reset\s*\([^)]*\)\s*{[^}]*count\.value\s*=\s*0/s);
  });

  it("muestra y actualiza el contador en el template", async () => {
    const wrapper = mount(Counter);

    expect(wrapper.get('[data-testid="count"]').text()).toBe("Contador: 0");

    await wrapper.get('[data-testid="increment-button"]').trigger("click");
    expect(wrapper.get('[data-testid="count"]').text()).toBe("Contador: 1");

    await wrapper.get('[data-testid="reset-button"]').trigger("click");

    expect(wrapper.get('[data-testid="count"]').text()).toBe("Contador: 0");
  });
});
