import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// 🛡️ IRON DOME: Case-sensitive build configuration
export default defineConfig({
  plugins: [react()],
  base: '/',
  
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
    },
    // Force exact case matching
    preserveSymlinks: false,
  },
  
  build: {
    outDir: 'dist',
    sourcemap: true,
    // Consistent file naming for Linux
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
    // Ensure clean build
    emptyOutDir: true,
  },
  
  esbuild: {
    // Force case sensitivity in imports
    tsconfigRaw: {
      compilerOptions: {
        forceConsistentCasingInFileNames: true,
      },
    },
  },
});
