/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Restores the modern font
      },
      colors: {
        // The "Happy Hunter" Gold
        primary: {
          DEFAULT: '#FACC15', // Vibrant Gold (Yellow-400)
          hover: '#EAB308',   // Slightly darker for hover
          foreground: '#000000',
        },
        // The "Happy Hunter" Deep Navy
        dark: {
          DEFAULT: '#0f172a', // Slate-900 (Main Background)
          lighter: '#1e293b', // Slate-800 (Card Background)
          accent: '#334155',  // Slate-700 (Borders)
        },
        // Neutral Grays for text
        gray: {
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          800: '#1f2937',
          900: '#111827',
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-glow': 'conic-gradient(from 180deg at 50% 50%, #1e293b 0deg, #0f172a 360deg)',
      },
    },
  },
  plugins: [],
}
