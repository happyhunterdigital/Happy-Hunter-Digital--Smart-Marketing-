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
        sans: ['Inter', 'sans-serif'], // This restores the clean, premium font
      },
      colors: {
        // The "Happy Hunter" Brand Colors
        primary: {
          DEFAULT: '#FACC15', // Vibrant Gold (matches your buttons)
          hover: '#EAB308',   // Slightly darker Gold for hover states
          foreground: '#000000', // Black text on Gold buttons
        },
        dark: {
          DEFAULT: '#0f172a', // Deep Navy (Main Background)
          lighter: '#1e293b', // Lighter Navy (For your Service Cards)
          accent: '#334155',  // Slate Blue (For borders/lines)
        },
        // Neutral Grays for text hierarchy
        gray: {
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db', // Secondary text
          400: '#9ca3af',
          500: '#6b7280',
          800: '#1f2937',
          900: '#111827',
        }
      },
      backgroundImage: {
        // This adds the subtle glow effect seen in your original hero section
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-glow': 'conic-gradient(from 180deg at 50% 50%, #1e293b 0deg, #0f172a 360deg)',
      },
    },
  },
  plugins: [],
}
