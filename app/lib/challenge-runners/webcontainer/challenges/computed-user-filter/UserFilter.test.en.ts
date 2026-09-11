import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import source from "./UserFilter.vue?raw";
// @ts-expect-error Virtual file mounted by the challenge runner. Example: src/Component.vue.
import UserFilter from "./UserFilter.vue";

const PROVIDED_USERS = ["Ada Lovelace", "Evan You", "Tim Berners-Lee", "Terry Davis"];

describe("UserFilter.vue", () => {
  it("imports computed and uses it to derive filtered users", () => {
    expect(source).toMatch(
      /^\s*import\s*{[^}]*\bcomputed\b[^}]*}\s*from\s*["']vue["'];?/m,
    );
    expect(source).toMatch(/^\s*const\s+filteredUsers\s*=\s*computed\s*\(/m);
  });

  it("filters users from the search input", async () => {
    const wrapper = mount(UserFilter);
    const renderedUsers = wrapper
      .findAll('[data-testid="user-item"]')
      .map((item) => item.text());

    expect(renderedUsers).toEqual(PROVIDED_USERS);
    expect(wrapper.get('[data-testid="result-count"]').text()).toContain(
      String(PROVIDED_USERS.length),
    );

    await wrapper.get('[data-testid="search-input"]').setValue("ada");

    const users = wrapper.findAll('[data-testid="user-item"]');
    const expectedUsers = PROVIDED_USERS.filter((user) => user.toLowerCase().includes("ada"));

    expect(users.map((user) => user.text())).toEqual(expectedUsers);
    expect(wrapper.get('[data-testid="result-count"]').text()).toContain(
      String(expectedUsers.length),
    );
  });

  it("clears the search and restores the full list", async () => {
    const wrapper = mount(UserFilter);

    await wrapper.get('[data-testid="search-input"]').setValue("evan");
    expect(wrapper.findAll('[data-testid="user-item"]')).toHaveLength(
      PROVIDED_USERS.filter((user) => user.toLowerCase().includes("evan")).length,
    );

    await wrapper.get('[data-testid="clear-button"]').trigger("click");

    expect(
      wrapper.findAll('[data-testid="user-item"]').map((user) => user.text()),
    ).toEqual(PROVIDED_USERS);
  });
});
