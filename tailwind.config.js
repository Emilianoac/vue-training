/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "selector",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,vue}",
  ],
  theme: {
    extend: {
      colors: {
        "color-primary": "#41b883",
        "color-primary-hover": "#339870",
        "slate": {
          900: "#121D37",
        }
      }
    },
  },
  plugins: [],
}