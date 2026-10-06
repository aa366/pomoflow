/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        canvas: "#F6F7F2",
        ink: "#202923",
        muted: "#7D877F",
        line: "#E3E8E0",
        pine: "#34765A",
        "pine-soft": "#DCEBE1",
        coral: "#E88968",
        track: "#E5E9E3",
      },
    },
  },
  plugins: [],
};
