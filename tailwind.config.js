/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        // This restores your specific Gold/Yellow branding
        primary: {
          DEFAULT: '#fbbf24', // Amber gold
          hover: '#d97706',
        },
        // This restores the Dark Navy background
        dark: {
          DEFAULT: '#0f172a', // Slate 900 (Deep Navy)
          lighter: '#1e293b', // Slate 800
        }
      },
    },
  },
  plugins: [],
}
