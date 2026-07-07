import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import source from "./QuestionWatcher.vue?raw";
// @ts-expect-error Virtual file mounted by the challenge runner. Example: src/Component.vue.
import QuestionWatcher from "./QuestionWatcher.vue";

describe("QuestionWatcher.vue", () => {
  it("usa watch para reaccionar a cambios de la pregunta", () => {
    expect(source).toContain("watch");
    expect(source).toMatch(/watch\s*\(/);
  });

  it("muestra el mensaje inicial", () => {
    const wrapper = mount(QuestionWatcher);

    expect(wrapper.get('[data-testid="answer"]').text()).toBe(
      "Escribe una pregunta que termine en ?",
    );
    expect(wrapper.findAll('[data-testid="log-entry"]')).toHaveLength(0);
  });

  it("pide terminar con signo de pregunta si el texto no parece una pregunta", async () => {
    const wrapper = mount(QuestionWatcher);

    await wrapper.get('[data-testid="question-input"]').setValue("Vue reacciona");

    expect(wrapper.get('[data-testid="answer"]').text()).toBe(
      "Las preguntas deben terminar con ?",
    );
    expect(wrapper.get('[data-testid="log-entry"]').text()).toBe(
      "Cambio detectado: Vue reacciona",
    );
  });

  it("responde cuando el texto termina con signo de pregunta", async () => {
    const wrapper = mount(QuestionWatcher);

    await wrapper.get('[data-testid="question-input"]').setValue("Vue reacciona?");

    expect(wrapper.get('[data-testid="answer"]').text()).toBe(
      "Buena pregunta. Vue reaccionó al cambio.",
    );
    expect(wrapper.get('[data-testid="log-entry"]').text()).toBe(
      "Cambio detectado: Vue reacciona?",
    );
  });

  it("registra cada cambio no vacio", async () => {
    const wrapper = mount(QuestionWatcher);

    await wrapper.get('[data-testid="question-input"]').setValue("Vue");
    await wrapper.get('[data-testid="question-input"]').setValue("Vue?");

    const entries = wrapper.findAll('[data-testid="log-entry"]');
    expect(entries).toHaveLength(2);
    expect(entries[0]?.text()).toBe("Cambio detectado: Vue");
    expect(entries[1]?.text()).toBe("Cambio detectado: Vue?");
  });
});
