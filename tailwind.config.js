const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["content/**/*.md", "layouts/**/*.html"],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "10px",
        sm: "20px",
        lg: "30px",
      },
    },
    extend: {
      colors: {
        primary: "#D9297D",
        secondary: "#B70E5F",
        orange: "#F18520",
        dark: "#151523",
        darker: "#13131F",
        light: "#FAFAFB",
        lightgray: "#F5F1F3",
        muted: "#B9B9BD",
        gray: "#6C6C78",
      },
      fontFamily: {
        grostesk: ["Grostesk", ...defaultTheme.fontFamily.sans],
        graphik: ["Graphik", ...defaultTheme.fontFamily.sans],
        "ibm-plex-mono": ["IBM Plex Mono", ...defaultTheme.fontFamily.mono],
      },
    },
  },
  plugins: [],
};
