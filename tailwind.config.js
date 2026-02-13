/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        red: {
          dark: "#BF3B44",
          DEFAULT: "#F3BABD",
          light: "#F4E6E7",
        },
        green: {
          dark: "#639339",
          DEFAULT: "#CBE4B4",
          light: "#E5F0DB",
        },
        gray: {
          1: "#1B1D1E",
          2: "#333638",
          3: "#5C6265",
          4: "#B9BBBC",
          5: "#DDDEDF",
          6: "#EFF0F0",
          7: "#FAFAFA",
        },
        white: "#FFFFFF",
      },
      fontFamily: {
        nunito_regular: ["Nunito_400Regular"],
        nunito_bold: ["Nunito_700Bold"],
      },
      fontSize: {
        xs: "12px",
        sm: "14px",
        base: "16px",
        lg: "18px",
        xl: "24px",
        "2xl": "32px",
      },
      lineHeight: {
        tight: "130%",
      },
    },
  },
  plugins: [],
}
