const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["content/**/*.md", "layouts/**/*.html"],
  theme: {
    extend: {
      colors: {
        primary: "#403a60",
        secondary: "#8d89a4",
        dark: "#051524",
        cream: "#fffaee",
        "white-40": "rgba(255, 255, 255, 0.4)",
        orange: "#e9aa02",
      },
      fontFamily: {
        "primary-bold": ["Fontin-Bold", ...defaultTheme.fontFamily.serif],
        "primary-italic": ["Fontin-Italic", ...defaultTheme.fontFamily.serif],
        "primary-regular": ["Fontin-Regular", ...defaultTheme.fontFamily.serif],
      },
      backgroundImage: {
        footer: "url('/images/bg-footer.jpg')",
      },
    },
  },
  plugins: [],
};
