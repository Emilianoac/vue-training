import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";
import { createI18n } from "vue-i18n";
import LangSwitcher from "../../components/LangToggleComponent.vue";

const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: "en",
  fallbackLocale: "en",
  messages: {
    en: {
      general: {
        english: "English",
        spanish: "Spanish"
      }
    },
    es: {
      general: {
        english: "Inglés",
        spanish: "Español"
      }
    }
  },
});

describe("Lang Toggle component", () => {
  it("should hide the dropdown menu by default", () => {
    const wrapper = mount(LangSwitcher, {
      global: { plugins: [i18n] },
    });
    const langToggleMenu = wrapper.find("[data-test='lang-toggle-menu']");

    expect(langToggleMenu.classes()).toContain("hidden");
  });

  it("should display the dropdown menu after clicking the button", async () => {
    const wrapper = mount(LangSwitcher, {
      global: { plugins: [i18n] },
    });
    const langToggleButton = wrapper.find("[data-test='lang-toggle-button']");
    const langToggleMenu = wrapper.find("[data-test='lang-toggle-menu']");

    await langToggleButton.trigger("click");

    expect(langToggleMenu.classes()).not.toContain("hidden");
  });

  it("should change the language when you click on an option", async () => {
    const wrapper = mount(LangSwitcher, {
      global: { plugins: [i18n] },
    });
    const spanishButton = wrapper.find("[data-test='lang-es']");
    
    await spanishButton.trigger("click");
  
    expect(i18n.global.locale.value).toBe("es"); 
  });
  
});
