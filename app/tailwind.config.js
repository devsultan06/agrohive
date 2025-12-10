/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: [
    "./App.tsx",
    "./screens/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./navigation/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
  
      colors: {
        "text-muted": "rgba(15,16,23,0.6)",
      },
      fontFamily: {
        parkinsans: ["Parkinsans-Regular"],
        "parkinsans-bold": ["Parkinsans-Bold"],
        "parkinsans-semibold": ["Parkinsans-SemiBold"],
        poppins: ["Poppins-Regular"],
        "poppins-semibold": ["Poppins-SemiBold"],
        "poppins-bold": ["Poppins-Bold"],
      },
    },
  },
  plugins: [],
};
