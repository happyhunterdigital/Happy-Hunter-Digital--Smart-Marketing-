import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // 1. Force the bundler to use our local shim instead of the broken package path
      'firebase/vertexai': path.resolve(__dirname, './src/shims/firebase-vertexai.ts') 
    }
  },
  optimizeDeps: {
    // 2. Stop Vite from trying to pre-bundle Firebase (avoids the scanning error)
    exclude: ['firebase', '@google/genai']
  },
  build: {
    commonjsOptions: {
      // 3. Help Vite convert CommonJS modules if needed
      transformMixedEsModules: true,
    },
  }
});
