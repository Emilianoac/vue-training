import { defineStore } from "pinia";
import { useI18n } from "vue-i18n";


export const useGeneralStore = defineStore("general", () => {
  const i18n = useI18n();
  const locale = i18n.locale as unknown as "en" | "es";

  return { 
    locale
  } 
});
