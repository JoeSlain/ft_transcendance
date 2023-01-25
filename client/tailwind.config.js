/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,tsx,ts,js}", "./src/**/**/*.{html,tsx,ts}"],

  theme: {
    colors: {
      "ata-red": "#f32c43",
      "ata-orange": "#ef7021",
      "ata-yellow": "#ebc630",
      "ata-green": "#9fae69",
      "ata-blue": "#2385aa",
      "ata-back": "#ffc47e",
    },
    extend: {
      fontFamily: {
        retro: ["Retro", "sans-serif"],
      },
    },
  },
  plugins: [require("daisyui"), require("tailwind-scrollbar")],
  daisyui: {
    themes: ["retro"],
  },
};