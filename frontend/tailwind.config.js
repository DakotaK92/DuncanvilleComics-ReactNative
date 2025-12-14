/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        gothamBlack: ["Gotham-Black"],
        gothamBlackItalic: ["Gotham-BlackItalic"],
        gothamBold: ["Gotham-Bold"],
        gothamBoldItalic: ["Gotham-BoldItalic"],
        gothamLight: ["Gotham-Light"],
        gothamLightItalic: ["Gotham-LightItalic"],
        gothamMedium: ["Gotham-Medium"],
        gothamMediumItalic: ["Gotham-MediumItalic"],
        gothamThin: ["Gotham-Thin"],
        gothamThinItalic: ["Gotham-ThinItalic"],
        gothamUltra: ["Gotham-Ultra"],
        gothamUltraItalic: ["Gotham-UltraItalic"],
        gothamXLight: ["Gotham-XLight"],
        gothamXLightItalic: ["Gotham-XLightItalic"],
      }
    },
  },
  plugins: [],
}