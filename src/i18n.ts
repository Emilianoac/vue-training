import { createI18n } from "vue-i18n";
import getCookie from "@/utils/getCookie";
import en from "@/locales/en/index";
import es from "@/locales/es/index";

export const i18n = createI18n({
  locale: getCookie("locale") || "en",
  legacy: false,
  fallbackLocale: "en",
  messages: {
    en: en,
    es: es,
  }
});
