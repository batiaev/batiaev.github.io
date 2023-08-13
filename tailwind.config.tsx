/* eslint-disable no-undef */
/* eslint-disable indent */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      screens: {
        "3xl": "1400px",
      },
      colors: {
        // "dark-gray": "#151A1F",
        // "dark-gray-900": "#1b2125",
        // "dark-gray-800": "#1e2629",
        // "dark-gray-700": "#3C434B",
        // "dark-gray-400": "#585F67",
        // "light-gray-700": "#6D747C",
        // "light-gray-600": "#8B959E",
        // "light-gray-500": "#21262A",
        // "light-gray-300": "#C6CBCE",
        // "light-gray-400": "#A9AEB0",
        // "light-gray-200": "#E8EBEF",
        // "light-gray": "#E1E5F0",
        // "gray-95": "#F2F2F2",
        // "primary-teal": "#62C9D0",
        // "primary-black": "#0D1116",
        // "black-900": "#0B1629",
        // "eerie-black": "#1E1E1E",
        // "red-700": "#AC4B45",
        // "red-500": "#FF554A",
        "white-smoke": "#F7F7F7",
        // green: "#5BB471",
      },
      backgroundImage: {
        // "reg-id": "url('/public/images/0_bg.png')",
      },
      transitionProperty: {
        height: "height",
      },
      sans: [
        "Inter var, sans-serif",
        {
          fontFeatureSettings: "'cv11', 'ss01'",
          fontVariationSettings: "'opsz' 32",
        },
      ],
    },
  },
  plugins: [
    // ...
    require("@tailwindcss/forms"),
  ],
};
