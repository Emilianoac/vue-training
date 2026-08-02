import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
// @ts-expect-error Virtual file mounted by the challenge runner.
import App from "./App.vue";
// @ts-expect-error Virtual file mounted by the challenge runner.
import UserList from "./UserList.vue";

const users = [
  { id: 1, name: "Ada Lovelace", role: "Programmer" },
  { id: 2, name: "Grace Hopper", role: "Computer scientist" },
];

describe("UserList.vue", () => {
  it("declares an explicit contract with users and select", () => {
    const component = UserList as {
      emits?: string[];
      props?: Record<string, unknown>;
    };

    expect(component.props).toHaveProperty("users");
    expect(component.emits).toContain("select");
  });

  it("renders the received users and emits their selection", async () => {
    const wrapper = mount(UserList, { props: { users } });

    expect(wrapper.findAll('[data-testid="user-item"]')).toHaveLength(2);
    await wrapper.findAll('[data-testid="user-item"]')[1]?.trigger("click");
    expect(wrapper.emitted("select")).toEqual([[2]]);
  });
});

describe("App.vue", () => {
  it("filters the list and responds to the selected user", async () => {
    const wrapper = mount(App);

    await wrapper.get('[data-testid="search-input"]').setValue("Grace");
    const visibleUsers = wrapper.findAll('[data-testid="user-item"]');
    expect(visibleUsers).toHaveLength(1);
    expect(visibleUsers[0]?.text()).toContain("Grace Hopper");

    await visibleUsers[0]?.trigger("click");
    expect(wrapper.get('[data-testid="selected-user"]').text()).toContain("Grace Hopper");
  });
});
