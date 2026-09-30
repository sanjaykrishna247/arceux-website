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

// Each page's 3D scene is a lazy chunk. Preload it (and what it imports) from the HTML
// so it downloads in parallel with the page script and the robot is there on arrival.
const PRELOAD = { 'index.html': 'HeroScene', 'hardware.html': 'ExplodedScene' };
const preload3D = () => ({
  name: 'preload-3d',
  apply: 'build',
  transformIndexHtml: {
    order: 'post',
    handler(html, ctx) {
      const want = PRELOAD[ctx.filename.split('/').pop()];
      if (!want || !ctx.bundle) return html;
      const entry = Object.values(ctx.bundle).find((c) => c.type === 'chunk' && c.isDynamicEntry && c.name === want);
      if (!entry) return html;
      const files = new Set();
      const walk = (c) => {
        if (!c || files.has(c.fileName)) return;
        files.add(c.fileName);
        c.imports.forEach((f) => walk(ctx.bundle[f]));
      };
      walk(entry);
      return [...files].map((f) => ({
        tag: 'link',
        attrs: { rel: 'modulepreload', crossorigin: true, href: `/${f}` },
        injectTo: 'head',
      }));
    },
  },
});

export default defineConfig({
  plugins: [react(), cleanUrls(), preload3D()],
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
