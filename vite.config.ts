import { defineConfig } from 'vite';
import path from 'path';
import shopify from 'vite-plugin-shopify';
import cleanup from '@by-association-only/vite-plugin-shopify-clean';
import glob from 'fast-glob';

export default defineConfig({
  resolve: {
    alias: {
      '~': path.resolve(__dirname, './'),
      '@': path.resolve(__dirname, 'frontend'),
    },
  },
  server: {
    host: '127.0.0.1',
    port: 5173,
    strictPort: true,
    cors: true,
    origin: 'http://127.0.0.1:5173',
    hmr: {
      protocol: 'ws',
      host: '127.0.0.1',
      port: 5173,
    },
    fs: { strict: false },
  },
  optimizeDeps: {
    include: ['@studio-freight/lenis'],
  },
  plugins: [
    cleanup(),
    shopify({
      themeRoot: './',
      sourceCodeDir: 'frontend',
      entrypointsDir: 'frontend/entrypoints',
      snippetFile: 'entry.liquid',
      additionalEntrypoints: [
        ...glob.sync('frontend/styles/sections/**/*.scss'),
        ...glob.sync('frontend/scripts/sections/**/*.js'),
      ],
    }),
  ],
  build: {
    outDir: 'assets',
    emptyOutDir: true,
    sourcemap: true,
  },
});
