import { ref, computed } from "vue";
import { defineStore } from "pinia";

export const useGeneralStore = defineStore("general", () => {
  const locale = ref(document.cookie.split("=")[1] || "en");

  function setLocale(newLocale: string) {
    locale.value = newLocale;
    document.cookie = `locale=${newLocale}`;
  };

  return { locale, setLocale }
});
