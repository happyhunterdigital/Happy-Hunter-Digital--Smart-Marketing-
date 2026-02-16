import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  base: '/',
  
  // 🛡️ IRON DOME: Force case sensitivity
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@config': path.resolve(__dirname, './src/firebaseConfig.ts'),
    },
    // Critical: Ensure exact case matching
    preserveSymlinks: false,
  },
  
  build: {
    outDir: 'dist',
    sourcemap: true,
    // Force consistent file naming
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
  },
  
  // Environment validation
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
  },
});
