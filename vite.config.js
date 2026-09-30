import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Serve /hardware from hardware.html in dev and preview (Vercel does it via cleanUrls).
const cleanUrls = () => {
  const rewrite = (req, _res, next) => {
    if (req.url === '/hardware' || req.url.startsWith('/hardware?') || req.url === '/hardware/') {
      req.url = '/hardware.html' + (req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : '');
    }
    next();
  };
  return {
    name: 'clean-urls',
    // block bodies: returning a value here would register it as a post-middleware hook
    configureServer(server) {
      server.middlewares.use(rewrite);
    },
    configurePreviewServer(server) {
      server.middlewares.use(rewrite);
    },
  };
};

export default defineConfig({
  plugins: [react(), cleanUrls()],
  build: {
    outDir: 'dist',
    // three.js lives in the lazily loaded 3D scene chunk, off the critical path.
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        hardware: resolve(__dirname, 'hardware.html'),
      },
    },
  },
});
