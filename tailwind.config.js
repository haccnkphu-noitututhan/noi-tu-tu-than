/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        neoCream: "#FAF8F2",
        neoYellow: "#FEE227",
        neoRed: "#F43F5E",
        neoMint: "#10B981",
        neoCyan: "#06B6D4",
        neoPurple: "#A855F7",
        neoOrange: "#FB923C",
        neoDark: "#111827",
      },
      boxShadow: {
        neo: "4px 4px 0px #111827",
        "neo-sm": "2px 2px 0px #111827",
        "neo-lg": "6px 6px 0px #111827",
        "neo-xl": "8px 8px 0px #111827",
      },
      borderWidth: {
        '3': '3px',
      }
    },
  },
  plugins: [],
}
