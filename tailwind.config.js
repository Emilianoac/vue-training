/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "selector",
  content: [
    "./app/**/*.{js,ts,vue}",
  ],
  theme: {
    extend: {
      colors: {
        "color-primary": "#11ad68",
        "color-primary-hover": "#0f9b5e",
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [],
}
