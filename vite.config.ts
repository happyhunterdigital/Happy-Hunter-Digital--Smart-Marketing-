import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: false, // Never expose source in production
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in prod
      },
      output: {
        comments: false, // Remove comments
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          firebase: ['firebase/app', 'firebase/firestore', 'firebase/auth', 'firebase/functions'],
          vendor: ['react', 'react-dom'],
          routing: ['react-router-dom'],
          animation: ['framer-motion']
        }
      }
    }
  },
  // Optimize chunk sizes
  optimizeDeps: {
    include: ['firebase/app', 'firebase/firestore', 'firebase/auth'],
  }
})
