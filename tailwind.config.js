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
          500: '#FACC15',
          400: '#FDE047'
        }
      }
    },
  },
  plugins: [],
}
