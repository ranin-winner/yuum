// vite.config.ts
import { defineConfig } from "file:///Users/mirg/contara/starter-theme/node_modules/vite/dist/node/index.js";
import path from "path";
import shopify from "file:///Users/mirg/contara/starter-theme/node_modules/vite-plugin-shopify/dist/index.js";
import cleanup from "file:///Users/mirg/contara/starter-theme/node_modules/@by-association-only/vite-plugin-shopify-clean/dist/index.mjs";
var __vite_injected_original_dirname = "/Users/mirg/contara/starter-theme";
var vite_config_default = defineConfig({
  // base: '/assets/', // The base path of the build
  resolve: {
    alias: {
      "~": path.resolve(__vite_injected_original_dirname, "./")
    }
  },
  plugins: [
    cleanup(),
    shopify({
      // themeRoot: './',                // The root directory of your Shopify theme
      sourceCodeDir: "src",
      // The directory where your source code is located
      entrypointsDir: "src",
      // The directory where your entrypoints are located
      // additionalEntrypoints: [        // Additional entrypoints to generate script tags for
      // 'src/entry.theme.js'
      //],
      snippetFile: "entry.liquid"
      // The file to write the script tag to in the theme (CSS, JS, etc.)
    })
  ],
  build: {
    outDir: "assets",
    // Output directory for the build
    emptyOutDir: true,
    // Don't delete the outDir before building
    rollupOptions: {
      output: {
        entryFileNames: "[name].[hash].min.js",
        chunkFileNames: "[name].[hash].min.js",
        assetFileNames: "[name].[hash].min[extname]"
      }
    },
    sourcemap: false
    // Enable sourcemaps
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvbWlyZy9jb250YXJhL3N0YXJ0ZXItdGhlbWVcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9taXJnL2NvbnRhcmEvc3RhcnRlci10aGVtZS92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvbWlyZy9jb250YXJhL3N0YXJ0ZXItdGhlbWUvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHNob3BpZnkgZnJvbSAndml0ZS1wbHVnaW4tc2hvcGlmeSc7XG5pbXBvcnQgY2xlYW51cCBmcm9tICdAYnktYXNzb2NpYXRpb24tb25seS92aXRlLXBsdWdpbi1zaG9waWZ5LWNsZWFuJztcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgLy8gYmFzZTogJy9hc3NldHMvJywgLy8gVGhlIGJhc2UgcGF0aCBvZiB0aGUgYnVpbGRcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiB7XG4gICAgICAnfic6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuLycpLFxuICAgIH0sXG4gIH0sXG4gIHBsdWdpbnM6IFtcbiAgICBjbGVhbnVwKCksXG4gICAgc2hvcGlmeSh7XG4gICAgICAvLyB0aGVtZVJvb3Q6ICcuLycsICAgICAgICAgICAgICAgIC8vIFRoZSByb290IGRpcmVjdG9yeSBvZiB5b3VyIFNob3BpZnkgdGhlbWVcbiAgICAgIHNvdXJjZUNvZGVEaXI6ICdzcmMnLCAvLyBUaGUgZGlyZWN0b3J5IHdoZXJlIHlvdXIgc291cmNlIGNvZGUgaXMgbG9jYXRlZFxuICAgICAgZW50cnlwb2ludHNEaXI6ICdzcmMnLCAvLyBUaGUgZGlyZWN0b3J5IHdoZXJlIHlvdXIgZW50cnlwb2ludHMgYXJlIGxvY2F0ZWRcbiAgICAgIC8vIGFkZGl0aW9uYWxFbnRyeXBvaW50czogWyAgICAgICAgLy8gQWRkaXRpb25hbCBlbnRyeXBvaW50cyB0byBnZW5lcmF0ZSBzY3JpcHQgdGFncyBmb3JcbiAgICAgIC8vICdzcmMvZW50cnkudGhlbWUuanMnXG4gICAgICAvL10sXG4gICAgICBzbmlwcGV0RmlsZTogJ2VudHJ5LmxpcXVpZCcsIC8vIFRoZSBmaWxlIHRvIHdyaXRlIHRoZSBzY3JpcHQgdGFnIHRvIGluIHRoZSB0aGVtZSAoQ1NTLCBKUywgZXRjLilcbiAgICB9KSxcbiAgXSxcbiAgYnVpbGQ6IHtcbiAgICBvdXREaXI6ICdhc3NldHMnLCAvLyBPdXRwdXQgZGlyZWN0b3J5IGZvciB0aGUgYnVpbGRcbiAgICBlbXB0eU91dERpcjogdHJ1ZSwgLy8gRG9uJ3QgZGVsZXRlIHRoZSBvdXREaXIgYmVmb3JlIGJ1aWxkaW5nXG4gICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgb3V0cHV0OiB7XG4gICAgICAgIGVudHJ5RmlsZU5hbWVzOiAnW25hbWVdLltoYXNoXS5taW4uanMnLFxuICAgICAgICBjaHVua0ZpbGVOYW1lczogJ1tuYW1lXS5baGFzaF0ubWluLmpzJyxcbiAgICAgICAgYXNzZXRGaWxlTmFtZXM6ICdbbmFtZV0uW2hhc2hdLm1pbltleHRuYW1lXScsXG4gICAgICB9LFxuICAgIH0sXG4gICAgc291cmNlbWFwOiBmYWxzZSwgLy8gRW5hYmxlIHNvdXJjZW1hcHNcbiAgfSxcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFxUixTQUFTLG9CQUFvQjtBQUNsVCxPQUFPLFVBQVU7QUFDakIsT0FBTyxhQUFhO0FBQ3BCLE9BQU8sYUFBYTtBQUhwQixJQUFNLG1DQUFtQztBQUt6QyxJQUFPLHNCQUFRLGFBQWE7QUFBQTtBQUFBLEVBRTFCLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQUssS0FBSyxRQUFRLGtDQUFXLElBQUk7QUFBQSxJQUNuQztBQUFBLEVBQ0Y7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLFFBQVE7QUFBQSxJQUNSLFFBQVE7QUFBQTtBQUFBLE1BRU4sZUFBZTtBQUFBO0FBQUEsTUFDZixnQkFBZ0I7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLE1BSWhCLGFBQWE7QUFBQTtBQUFBLElBQ2YsQ0FBQztBQUFBLEVBQ0g7QUFBQSxFQUNBLE9BQU87QUFBQSxJQUNMLFFBQVE7QUFBQTtBQUFBLElBQ1IsYUFBYTtBQUFBO0FBQUEsSUFDYixlQUFlO0FBQUEsTUFDYixRQUFRO0FBQUEsUUFDTixnQkFBZ0I7QUFBQSxRQUNoQixnQkFBZ0I7QUFBQSxRQUNoQixnQkFBZ0I7QUFBQSxNQUNsQjtBQUFBLElBQ0Y7QUFBQSxJQUNBLFdBQVc7QUFBQTtBQUFBLEVBQ2I7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
