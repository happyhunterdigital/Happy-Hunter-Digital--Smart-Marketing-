/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
    './index.html',
    './*.{js,ts,jsx,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // FORCE THE GOLD (Yellow-400 from your screenshot)
        primary: {
          DEFAULT: '#FACC15', 
          foreground: '#000000',
        },
        // FORCE THE NAVY (Slate-950)
        background: '#020617', 
        foreground: '#F8FAFC',
        
        // Cards need to be slightly lighter to be visible
        card: {
          DEFAULT: '#0f172a', // Slate-900
          foreground: '#F8FAFC',
        },
        
        // Secondary elements
        muted: {
          DEFAULT: '#1e293b',
          foreground: '#94a3b8',
        },
        accent: {
          DEFAULT: '#1e293b',
          foreground: '#F8FAFC',
        },
        border: '#1e293b',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
