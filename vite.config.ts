import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // POINT DIRECTLY TO THE ROOT FILE
      'firebase/vertexai': path.resolve(__dirname, './firebaseShim.ts') 
    }
  },
  optimizeDeps: {
    exclude: ['firebase', '@google/genai']
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  }
});
