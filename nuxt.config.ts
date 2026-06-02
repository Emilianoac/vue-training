import tailwindcss from "@tailwindcss/vite";

const webContainerHeaders = {
  "Cross-Origin-Embedder-Policy": "require-corp",
  "Cross-Origin-Opener-Policy": "same-origin",
};

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: [
    "@pinia/nuxt",
    "@nuxtjs/i18n",
    "@nuxt/icon",
    "@nuxtjs/color-mode",
    "@nuxt/test-utils/module",
    "@nuxt/content",
    "shadcn-nuxt",
  ],
  css: ["~/assets/css/tailwind.css", "~/assets/css/editor.css"],
  vite: {
    plugins: [tailwindcss()],
  },
  app: {
    head: {
      title: "Vue Training",
    },
  },
  routeRules: {
    "/challenges/**": {
      appLayout: "activity",
      ssr: false,
      headers: webContainerHeaders,
    },
    "/learn/learning-path/*/challenges/**": {
      appLayout: "activity",
      ssr: false,
      headers: webContainerHeaders,
    },
    "/learn/learning-path/**/challenges/**": {
      appLayout: "activity",
      ssr: false,
      headers: webContainerHeaders,
    },
    "/learn/learning-path/*/quizzes/**": { appLayout: "activity", ssr: false },
    "/learn/learning-path/**/quizzes/**": { appLayout: "activity", ssr: false },
    "/quizzes/**": { appLayout: "activity", ssr: false },
    "/learn": { appLayout: "learn", ssr: false },
    "/learn/**": { appLayout: "learn", ssr: false },
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
    fallback: "dark",
  },
  content: {
    renderer: {
      anchorLinks: {
        h4: false,
      },
    },
    experimental: { sqliteConnector: "native" },
  },
  shadcn: {
    prefix: "",
    componentDir: "@/components/ui",
  },
});
