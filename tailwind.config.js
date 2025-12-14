import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./services/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        // Your Custom Brand System
        brand: {
          yellow: '#FACC15',
          dark: '#0F172A',
          gray: '#334155'
        },
        // SAFETY MAPPING: This ensures standard Tailwind classes also use your colors
        primary: {
          DEFAULT: '#FACC15', // Maps 'text-primary' to your Yellow
          foreground: '#0F172A',
        },
        background: '#0F172A', // Maps 'bg-background' to your Navy
      }
    }
  },
  plugins: [
    typography,
  ],
}
