import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: false,
    minify: 'esbuild', // Fast native Go-based minifier instead of slow Terser
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Dynamic chunking to split giant vendor bundles automatically
          if (id.includes('node_modules')) {
            if (id.includes('firebase')) return 'firebase';
            if (id.includes('react-router-dom')) return 'routing';
            if (id.includes('react') || id.includes('react-dom')) return 'vendor';
            if (id.includes('framer-motion')) return 'animation';
            if (id.includes('lucide-react')) return 'icons';
            return 'vendor-libs'; // Everything else from node_modules
          }
        }
      }
    }
  },
  // Replaces Terser drop_console with lightning-fast Esbuild stripping
  esbuild: {
    drop: ['console', 'debugger'],
    legalComments: 'none'
  },
  optimizeDeps: {
    include: ['firebase/app', 'firebase/firestore', 'firebase/auth'],
  }
})
