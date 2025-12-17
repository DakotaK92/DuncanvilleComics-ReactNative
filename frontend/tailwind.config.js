/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        gothamBlack: ["Gotham-Black"],
        gothamBold: ["Gotham-Bold"],
        gothamLight: ["Gotham-Light"],
        gothamMedium: ["Gotham-Medium"],
        gothamThin: ["Gotham-Thin"],
        gothamUltra: ["Gotham-Ultra"],
        gothamXLight: ["Gotham-XLight"],
      }
    },
  },
  plugins: [],
}