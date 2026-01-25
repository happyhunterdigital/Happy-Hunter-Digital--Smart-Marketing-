import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    // Stability: Ensures mixed modules (commonjs/esm) don't crash the build
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  }
});
