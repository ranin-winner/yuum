// vite.config.ts
import { defineConfig } from "file:///D:/project/shopify-com/yuum/node_modules/vite/dist/node/index.js";
import path from "path";
import shopify from "file:///D:/project/shopify-com/yuum/node_modules/vite-plugin-shopify/dist/index.js";
import cleanup from "file:///D:/project/shopify-com/yuum/node_modules/@by-association-only/vite-plugin-shopify-clean/dist/index.mjs";
import glob from "file:///D:/project/shopify-com/yuum/node_modules/fast-glob/out/index.js";
var __vite_injected_original_dirname = "D:\\project\\shopify-com\\yuum";
var vite_config_default = defineConfig({
  // base: '/assets/', // The base path of the build
  resolve: {
    alias: {
      "~": path.resolve(__vite_injected_original_dirname, "./"),
      "@": path.resolve(__vite_injected_original_dirname, "frontend")
    }
  },
  css: {},
  plugins: [
    cleanup(),
    shopify({
      themeRoot: "./",
      // The root directory of the Shopify theme
      sourceCodeDir: "frontend",
      // The directory where the source code is located
      entrypointsDir: "frontend/entrypoints",
      // The directory where the entrypoints are located
      snippetFile: "entry.liquid",
      // The file where the script tag is injected
      additionalEntrypoints: [
        ...glob.sync("frontend/styles/sections/**/*.scss"),
        // SCSS entrypoints
        ...glob.sync("frontend/scripts/sections/**/*.js")
        // JavaScript entrypoints
      ]
    })
  ],
  build: {
    outDir: "assets",
    // Output directory for the build
    emptyOutDir: true,
    // Don't delete the outDir before building
    sourcemap: true
    // Enable sourcemaps
    // rollupOptions: {
    //   input: {
    //     main:       path.resolve(__dirname, 'frontend/entrypoints/main.theme.js'),
    //     product:    path.resolve(__dirname, 'frontend/entrypoints/theme.product.js'),
    //   },
    //   output: {
    //     entryFileNames: '[name].[hash].min.js',
    //     chunkFileNames: '[name].[hash].min.js',
    //     assetFileNames: '[name].[hash].min[extname]',
    //   },
    // },
    // sourcemap: false, // Enable sourcemaps
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxwcm9qZWN0XFxcXHNob3BpZnktY29tXFxcXHl1dW1cIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXHByb2plY3RcXFxcc2hvcGlmeS1jb21cXFxceXV1bVxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovcHJvamVjdC9zaG9waWZ5LWNvbS95dXVtL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCBzaG9waWZ5IGZyb20gJ3ZpdGUtcGx1Z2luLXNob3BpZnknO1xuaW1wb3J0IGNsZWFudXAgZnJvbSAnQGJ5LWFzc29jaWF0aW9uLW9ubHkvdml0ZS1wbHVnaW4tc2hvcGlmeS1jbGVhbic7XG5pbXBvcnQgZ2xvYiBmcm9tICdmYXN0LWdsb2InO1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICAvLyBiYXNlOiAnL2Fzc2V0cy8nLCAvLyBUaGUgYmFzZSBwYXRoIG9mIHRoZSBidWlsZFxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IHtcbiAgICAgICd+JzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4vJyksXG4gICAgICAnQCc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICdmcm9udGVuZCcpLFxuICAgIH0sXG4gIH0sXG4gIGNzczoge1xuXG4gIH0sXG4gIHBsdWdpbnM6IFtcbiAgICBjbGVhbnVwKCksXG4gICAgc2hvcGlmeSh7XG4gICAgICB0aGVtZVJvb3Q6ICcuLycsICAgICAgICAgICAgICAgICAgICAgICAgLy8gVGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoZSBTaG9waWZ5IHRoZW1lXG4gICAgICBzb3VyY2VDb2RlRGlyOiAnZnJvbnRlbmQnLCAgICAgICAgICAgICAgLy8gVGhlIGRpcmVjdG9yeSB3aGVyZSB0aGUgc291cmNlIGNvZGUgaXMgbG9jYXRlZFxuICAgICAgZW50cnlwb2ludHNEaXI6ICdmcm9udGVuZC9lbnRyeXBvaW50cycsIC8vIFRoZSBkaXJlY3Rvcnkgd2hlcmUgdGhlIGVudHJ5cG9pbnRzIGFyZSBsb2NhdGVkXG4gICAgICBzbmlwcGV0RmlsZTogJ2VudHJ5LmxpcXVpZCcsICAgICAgICAgICAgLy8gVGhlIGZpbGUgd2hlcmUgdGhlIHNjcmlwdCB0YWcgaXMgaW5qZWN0ZWRcbiAgICAgIGFkZGl0aW9uYWxFbnRyeXBvaW50czogW1xuICAgICAgICAuLi5nbG9iLnN5bmMoJ2Zyb250ZW5kL3N0eWxlcy9zZWN0aW9ucy8qKi8qLnNjc3MnKSwgLy8gU0NTUyBlbnRyeXBvaW50c1xuICAgICAgICAuLi5nbG9iLnN5bmMoJ2Zyb250ZW5kL3NjcmlwdHMvc2VjdGlvbnMvKiovKi5qcycpICAgLy8gSmF2YVNjcmlwdCBlbnRyeXBvaW50c1xuICAgICAgXSxcbiAgICB9KSxcbiAgXSxcbiAgYnVpbGQ6IHtcbiAgICBvdXREaXI6ICdhc3NldHMnLCAvLyBPdXRwdXQgZGlyZWN0b3J5IGZvciB0aGUgYnVpbGRcbiAgICBlbXB0eU91dERpcjogdHJ1ZSwgLy8gRG9uJ3QgZGVsZXRlIHRoZSBvdXREaXIgYmVmb3JlIGJ1aWxkaW5nXG4gICAgc291cmNlbWFwOiB0cnVlLCAvLyBFbmFibGUgc291cmNlbWFwc1xuICAgIC8vIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAvLyAgIGlucHV0OiB7XG4gICAgLy8gICAgIG1haW46ICAgICAgIHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICdmcm9udGVuZC9lbnRyeXBvaW50cy9tYWluLnRoZW1lLmpzJyksXG4gICAgLy8gICAgIHByb2R1Y3Q6ICAgIHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICdmcm9udGVuZC9lbnRyeXBvaW50cy90aGVtZS5wcm9kdWN0LmpzJyksXG4gICAgLy8gICB9LFxuICAgIC8vICAgb3V0cHV0OiB7XG4gICAgLy8gICAgIGVudHJ5RmlsZU5hbWVzOiAnW25hbWVdLltoYXNoXS5taW4uanMnLFxuICAgIC8vICAgICBjaHVua0ZpbGVOYW1lczogJ1tuYW1lXS5baGFzaF0ubWluLmpzJyxcbiAgICAvLyAgICAgYXNzZXRGaWxlTmFtZXM6ICdbbmFtZV0uW2hhc2hdLm1pbltleHRuYW1lXScsXG4gICAgLy8gICB9LFxuICAgIC8vIH0sXG4gICAgLy8gc291cmNlbWFwOiBmYWxzZSwgLy8gRW5hYmxlIHNvdXJjZW1hcHNcbiAgfSxcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUEyUSxTQUFTLG9CQUFvQjtBQUN4UyxPQUFPLFVBQVU7QUFDakIsT0FBTyxhQUFhO0FBQ3BCLE9BQU8sYUFBYTtBQUNwQixPQUFPLFVBQVU7QUFKakIsSUFBTSxtQ0FBbUM7QUFNekMsSUFBTyxzQkFBUSxhQUFhO0FBQUE7QUFBQSxFQUUxQixTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxLQUFLLEtBQUssUUFBUSxrQ0FBVyxJQUFJO0FBQUEsTUFDakMsS0FBSyxLQUFLLFFBQVEsa0NBQVcsVUFBVTtBQUFBLElBQ3pDO0FBQUEsRUFDRjtBQUFBLEVBQ0EsS0FBSyxDQUVMO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxRQUFRO0FBQUEsSUFDUixRQUFRO0FBQUEsTUFDTixXQUFXO0FBQUE7QUFBQSxNQUNYLGVBQWU7QUFBQTtBQUFBLE1BQ2YsZ0JBQWdCO0FBQUE7QUFBQSxNQUNoQixhQUFhO0FBQUE7QUFBQSxNQUNiLHVCQUF1QjtBQUFBLFFBQ3JCLEdBQUcsS0FBSyxLQUFLLG9DQUFvQztBQUFBO0FBQUEsUUFDakQsR0FBRyxLQUFLLEtBQUssbUNBQW1DO0FBQUE7QUFBQSxNQUNsRDtBQUFBLElBQ0YsQ0FBQztBQUFBLEVBQ0g7QUFBQSxFQUNBLE9BQU87QUFBQSxJQUNMLFFBQVE7QUFBQTtBQUFBLElBQ1IsYUFBYTtBQUFBO0FBQUEsSUFDYixXQUFXO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxFQWFiO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
