/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./*.{js,ts,jsx,tsx}",      // Looks for files in the ROOT
    "./components/**/*.{js,ts,jsx,tsx}", // Looks in components folder
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
