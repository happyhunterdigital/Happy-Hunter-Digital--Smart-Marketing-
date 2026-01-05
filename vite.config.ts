import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Simple path resolution that works in all modes
      'firebase/vertexai': path.resolve('./firebaseShim.ts') 
    }
  },
  optimizeDeps: {
    exclude: ['firebase']
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  }
});
