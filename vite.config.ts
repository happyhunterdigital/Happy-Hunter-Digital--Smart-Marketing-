import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

// --- FIX FOR "type": "module" ---
// These lines recreate __dirname so it works in your project
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Point to the shim file in the root directory
      'firebase/vertexai': path.resolve(__dirname, './firebaseShim.ts') 
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
