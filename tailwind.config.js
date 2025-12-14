/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    // 1. Centers everything automatically (Matches your layout screenshots)
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '2rem',
        lg: '4rem',
        xl: '5rem',
        '2xl': '6rem',
      },
    },
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        border: "hsl(var(--border))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        
        // The "Happy Hunter" Gold (Extracted from your Buttons)
        primary: {
          DEFAULT: '#FACC15', // Vibrant Yellow-400
          hover: '#EAB308',   // Yellow-500
          foreground: '#000000', // Black text on Gold
        },
        
        // The "Premium Dark" Palette (Extracted from your Backgrounds)
        dark: {
          DEFAULT: '#0f172a', // Slate-900 (Main Background)
          lighter: '#1e293b', // Slate-800 (Card Background)
          border: '#334155',  // Slate-700 (Subtle Borders)
          muted: '#94a3b8',   // Slate-400 (Body Text)
        },
        
        // Secondary Accents (For badges/icons)
        secondary: {
          DEFAULT: '#1e293b',
          foreground: '#f8fafc',
        },
      },
      // 2. Custom Border Radius for that smooth button look
      borderRadius: {
        lg: "0.5rem",
        md: "calc(0.5rem - 2px)",
        sm: "calc(0.5rem - 4px)",
      },
    },
  },
  plugins: [],
}
