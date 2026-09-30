import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    // three.js lives in the lazily loaded 3D scene chunk, off the critical path.
    chunkSizeWarningLimit: 1200,
  },
});
