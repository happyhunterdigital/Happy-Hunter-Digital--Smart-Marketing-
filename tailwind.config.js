/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        yellow: {
          400: '#FDE047',
          500: '#FACC15',
          600: '#CA8A04'
        }
      }
    },
  },
  plugins: [],
}
