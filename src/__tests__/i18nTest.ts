import { createI18n } from "vue-i18n";
import en from "@/locales/en/index";
import es from "@/locales/es/index";

export const i18nTest = createI18n({
  locale: "en",
  fallbackLocale: "en",
  messages: {
    en: en,
    es: es,
  }
});