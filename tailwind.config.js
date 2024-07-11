const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["content/**/*.md", "layouts/**/*.html"],
  theme: {
    extend: {
      colors: {
        primary: "#403a60",
        secondary: "#8d89a4",
      },
    },
  },
  plugins: [],
};
