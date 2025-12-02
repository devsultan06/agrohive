/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: [
    "./App.tsx",
    "./screens/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      // fontFamily: {
      //   instrument: ["InstrumentSans-Regular", "System"],
      //   instrumentSemiBold: ["InstrumentSans-SemiBold", "System"],
      //   instrumentMedium: ["InstrumentSans-Medium", "System"],
      //   instrumentBold: ["InstrumentSans-Bold", "System"],
      //   sans: ["InstrumentSans-Regular", "System"],
      // },
      colors: {
        "text-muted": "rgba(15,16,23,0.6)",
      },
    },
  },
  plugins: [],
};
