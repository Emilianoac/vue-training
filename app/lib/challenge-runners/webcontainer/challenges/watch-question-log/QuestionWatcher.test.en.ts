import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import source from "./QuestionWatcher.vue?raw";
// @ts-expect-error Virtual file mounted by the challenge runner. Example: src/Component.vue.
import QuestionWatcher from "./QuestionWatcher.vue";

describe("QuestionWatcher.vue", () => {
  it("uses watch to react to question changes", () => {
    expect(source).toContain("watch");
    expect(source).toMatch(/watch\s*\(/);
  });

  it("renders the initial message", () => {
    const wrapper = mount(QuestionWatcher);

    expect(wrapper.get('[data-testid="answer"]').text()).toBe(
      "Write a question that ends with ?",
    );
    expect(wrapper.findAll('[data-testid="log-entry"]')).toHaveLength(0);
  });

  it("asks for a question mark when the text does not look like a question", async () => {
    const wrapper = mount(QuestionWatcher);

    await wrapper.get('[data-testid="question-input"]').setValue("Vue reacts");

    expect(wrapper.get('[data-testid="answer"]').text()).toBe(
      "Questions should end with ?",
    );
    expect(wrapper.get('[data-testid="log-entry"]').text()).toBe(
      "Change detected: Vue reacts",
    );
  });

  it("answers when the text ends with a question mark", async () => {
    const wrapper = mount(QuestionWatcher);

    await wrapper.get('[data-testid="question-input"]').setValue("Does Vue react?");

    expect(wrapper.get('[data-testid="answer"]').text()).toBe(
      "Good question. Vue reacted to the change.",
    );
    expect(wrapper.get('[data-testid="log-entry"]').text()).toBe(
      "Change detected: Does Vue react?",
    );
  });

  it("records every non-empty change", async () => {
    const wrapper = mount(QuestionWatcher);

    await wrapper.get('[data-testid="question-input"]').setValue("Vue");
    await wrapper.get('[data-testid="question-input"]').setValue("Vue?");

    const entries = wrapper.findAll('[data-testid="log-entry"]');
    expect(entries).toHaveLength(2);
    expect(entries[0]?.text()).toBe("Change detected: Vue");
    expect(entries[1]?.text()).toBe("Change detected: Vue?");
  });
});
