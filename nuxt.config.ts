// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ["@pinia/nuxt", "@nuxtjs/i18n", "nuxt-icon", "@nuxt/icon", "@nuxtjs/color-mode", "@nuxt/test-utils/module"],
  css: ["~/assets/css/main.css"],
  app: {
    head: {
      title: "Vue Training"
    },
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  i18n: {
    langDir: "locales",
    strategy: "no_prefix",
    defaultLocale: "en",
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "i18n_redirected",
      
    },
    locales: [
      { code: "en", language: "en-US", name: "English", file: "en.json", displayName: "English" },
      { code: "es", language: "es-ES", name: "Español", file: "es.json", displayName: "Español" },
    ],
  },
  colorMode: {
    preference: "dark",
    fallback: "dark"
  }
})