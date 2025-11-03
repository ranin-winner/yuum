import { defineConfig } from 'vite';
import shopify from 'vite-plugin-shopify';

export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 5173,
    origin: 'http://localhost:5173',
    cors: {
      origin: [
        /^https:\/\/.*\.myshopify\.com$/,
        'https://yuumuk.myshopify.com',
        /^https:\/\/.*\.shopifypreview\.com$/
      ],
      credentials: true
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': '*',
      'Access-Control-Allow-Private-Network': 'true'
    },
    hmr: {
      host: 'localhost',
      clientPort: 443
    }
  },
  plugins: [
    shopify()
  ]
});
