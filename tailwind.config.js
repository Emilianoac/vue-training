/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "selector",
  content: [
    "./app/**/*.{js,ts,vue}",
  ],
  theme: {
    container: {
      screens: {
        xl: "1280px"
      }
    },
    extend: {
      colors: {
        "brand-main": {
          "50" :  "#F0FBF6",
          "100": "#DAF5E9",
          "200": "#B9E9D5",
          "300": "#89D7B6",
          "400": "#52C295",
          "500": "#41B883",
          "600": "#31956C",
          "700": "#297759",
          "800": "#235F49",
          "900": "#1E4E3E",
          "950": "#112C23"
        },
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [],
}
