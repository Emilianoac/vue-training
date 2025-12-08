import { mount } from "@vue/test-utils";
import { describe, it, expect, vi } from "vitest";
import { createI18n } from "vue-i18n";
import LangSwitcher from "../../../app/components/layout/LangToggleComponent.vue";
import { nextTick } from "vue";

const locale = ref("en");
const setLocale = vi.fn((lang: string) => { locale.value = lang; });
const locales = [{ code: "en" }, { code: "es" }];
const t = (key: string) => key;

vi.mock("vue-i18n", () => ({
  useI18n: () => ({ locale, setLocale, locales, t }),
}));

describe("Lang Toggle component", () => {
  it("should hide the dropdown menu by default", () => {
    const wrapper = mount(LangSwitcher);
    const langToggleMenu = wrapper.find("[data-test='lang-toggle-menu']");

    expect(langToggleMenu.classes()).toContain("hidden");
  });

  it("should display the dropdown menu after clicking the button", async () => {
    const wrapper = mount(LangSwitcher);
    const langToggleButton = wrapper.find("[data-test='lang-toggle-button']");
    const langToggleMenu = wrapper.find("[data-test='lang-toggle-menu']");

    await langToggleButton.trigger("click");

    expect(langToggleMenu.classes()).not.toContain("hidden");
  });

  it("should change the language when you click on an option", async () => {
    const wrapper = mount(LangSwitcher);

    const toggleButton = wrapper.find("[data-test='lang-toggle-button']");
    await toggleButton.trigger("click");
    await nextTick();

    const spanishButton = wrapper.find("[data-test='lang-es']");
    expect(spanishButton.exists()).toBe(true);

    await spanishButton.trigger("click");

    expect(setLocale).toHaveBeenCalledWith("es");
    expect(locale.value).toBe("es");
  });

  describe("when clicking outside the dropdown menu", () => {
    it("should close the dropdown when clicking outside", async () => {
      const wrapper = mount(LangSwitcher);
      const langToggleMenu = wrapper.find("[data-test='lang-toggle-menu']");
      const langToggleButton = wrapper.find("[data-test='lang-toggle-button']");  
  
      await langToggleButton.trigger("click");
      document.dispatchEvent(new MouseEvent("mousedown", {bubbles: true}));
      await nextTick();
  
      expect(langToggleMenu.classes()).toContain("hidden");
    });

    it("should not close the dropdown when clicking inside", async () => {
      const wrapper = mount(LangSwitcher);
      const langToggleMenu = wrapper.find("[data-test='lang-toggle-menu']");
      const langToggleButton = wrapper.find("[data-test='lang-toggle-button']");
  
      await langToggleButton.trigger("click");
      await langToggleMenu.trigger("click");

      expect(langToggleMenu.classes()).not.toContain("hidden");
    });

    it("should add and remove the event listener", () => {
      const addEventListenerSpy = vi.spyOn(document, "addEventListener");
      const removeEventListenerSpy = vi.spyOn(document, "removeEventListener");
      const wrapper = mount(LangSwitcher);
  
      expect(addEventListenerSpy).toHaveBeenCalledWith("mousedown", expect.any(Function));
  
      wrapper.unmount();
  
      expect(removeEventListenerSpy).toHaveBeenCalledWith("mousedown", expect.any(Function));
    });
  });
});
