import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/",
  define: {
    // This takes the key from GitHub and "Stamps" it into the browser code
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY),
    'process.env.VITE_API_KEY': JSON.stringify(process.env.VITE_API_KEY),
  },
});
