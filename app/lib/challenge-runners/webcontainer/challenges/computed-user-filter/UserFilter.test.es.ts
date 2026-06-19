import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import source from "./UserFilter.vue?raw";
// @ts-expect-error Virtual file mounted by the challenge runner. Example: src/Component.vue.
import UserFilter from "./UserFilter.vue";

describe("UserFilter.vue", () => {
  it("usa computed para derivar los usuarios filtrados", () => {
    expect(source).toContain("computed");
    expect(source).toMatch(/computed\s*\(/);
  });

  it("muestra todos los usuarios antes de buscar", () => {
    const wrapper = mount(UserFilter);

    expect(wrapper.findAll('[data-testid="user-item"]')).toHaveLength(4);
    expect(wrapper.get('[data-testid="result-count"]').text()).toContain("4");
  });

  it("filtra usuarios desde el input de búsqueda", async () => {
    const wrapper = mount(UserFilter);

    await wrapper.get('[data-testid="search-input"]').setValue("ada");

    const users = wrapper.findAll('[data-testid="user-item"]');
    expect(users).toHaveLength(1);
    expect(users[0]?.text()).toBe("Ada Lovelace");
    expect(wrapper.get('[data-testid="result-count"]').text()).toContain("1");
  });

  it("limpia la búsqueda y restaura la lista completa", async () => {
    const wrapper = mount(UserFilter);

    await wrapper.get('[data-testid="search-input"]').setValue("evan");
    expect(wrapper.findAll('[data-testid="user-item"]')).toHaveLength(1);

    await wrapper.get('[data-testid="clear-button"]').trigger("click");

    expect(wrapper.findAll('[data-testid="user-item"]')).toHaveLength(4);
  });
});
