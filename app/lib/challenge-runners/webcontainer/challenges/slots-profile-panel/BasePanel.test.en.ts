import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
// @ts-expect-error Virtual file mounted by the challenge runner. Example: src/Component.vue.
import App from "./App.vue";
// @ts-expect-error Virtual file mounted by the challenge runner. Example: src/Component.vue.
import BasePanel from "./BasePanel.vue";

describe("BasePanel.vue", () => {
  it("renders the header fallback content", () => {
    const wrapper = mount(BasePanel);

    expect(wrapper.get('[data-testid="panel-header"]').text()).toBe("Panel");
  });

  it("distributes content across the three regions", () => {
    const wrapper = mount(BasePanel, {
      slots: {
        default: "<p>Main content</p>",
        header: "<h2>Custom header</h2>",
        actions: "<button>Continue</button>",
      },
    });

    expect(wrapper.get('[data-testid="panel-header"]').text()).toBe("Custom header");
    expect(wrapper.get('[data-testid="panel-content"]').text()).toBe("Main content");
    expect(wrapper.get('[data-testid="panel-actions"]').text()).toBe("Continue");
  });
});

describe("App.vue", () => {
  it("fills the panel from the parent component", () => {
    const wrapper = mount(App);
    const header = wrapper.get('[data-testid="panel-header"]');
    const actions = wrapper.get('[data-testid="panel-actions"]');

    expect(header.get('[data-testid="profile-title"]').text()).toBe("Ana's profile");
    expect(wrapper.get('[data-testid="profile-description"]').text()).toContain(
      "Review the information",
    );
    expect(actions.get('[data-testid="cancel-button"]').text()).toBe("Cancel");
    expect(actions.get('[data-testid="save-button"]').text()).toBe("Save");
  });
});
