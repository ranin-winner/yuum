// vite.config.ts
import { defineConfig } from "file:///C:/WindowEcommerce/ShopiFy/Contara/all-in-2.0/node_modules/vite/dist/node/index.js";
import path from "path";
import shopify from "file:///C:/WindowEcommerce/ShopiFy/Contara/all-in-2.0/node_modules/vite-plugin-shopify/dist/index.js";
import cleanup from "file:///C:/WindowEcommerce/ShopiFy/Contara/all-in-2.0/node_modules/@by-association-only/vite-plugin-shopify-clean/dist/index.mjs";
import glob from "file:///C:/WindowEcommerce/ShopiFy/Contara/all-in-2.0/node_modules/fast-glob/out/index.js";
var __vite_injected_original_dirname = "C:\\WindowEcommerce\\ShopiFy\\Contara\\all-in-2.0";
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxXaW5kb3dFY29tbWVyY2VcXFxcU2hvcGlGeVxcXFxDb250YXJhXFxcXGFsbC1pbi0yLjBcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFdpbmRvd0Vjb21tZXJjZVxcXFxTaG9waUZ5XFxcXENvbnRhcmFcXFxcYWxsLWluLTIuMFxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovV2luZG93RWNvbW1lcmNlL1Nob3BpRnkvQ29udGFyYS9hbGwtaW4tMi4wL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XHJcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xyXG5pbXBvcnQgc2hvcGlmeSBmcm9tICd2aXRlLXBsdWdpbi1zaG9waWZ5JztcclxuaW1wb3J0IGNsZWFudXAgZnJvbSAnQGJ5LWFzc29jaWF0aW9uLW9ubHkvdml0ZS1wbHVnaW4tc2hvcGlmeS1jbGVhbic7XHJcbmltcG9ydCBnbG9iIGZyb20gJ2Zhc3QtZ2xvYic7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xyXG4gIC8vIGJhc2U6ICcvYXNzZXRzLycsIC8vIFRoZSBiYXNlIHBhdGggb2YgdGhlIGJ1aWxkXHJcbiAgcmVzb2x2ZToge1xyXG4gICAgYWxpYXM6IHtcclxuICAgICAgJ34nOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi8nKSxcclxuICAgICAgJ0AnOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnZnJvbnRlbmQnKSxcclxuICAgIH0sXHJcbiAgfSxcclxuICBjc3M6IHtcclxuXHJcbiAgfSxcclxuICBwbHVnaW5zOiBbXHJcbiAgICBjbGVhbnVwKCksXHJcbiAgICBzaG9waWZ5KHtcclxuICAgICAgdGhlbWVSb290OiAnLi8nLCAgICAgICAgICAgICAgICAgICAgICAgIC8vIFRoZSByb290IGRpcmVjdG9yeSBvZiB0aGUgU2hvcGlmeSB0aGVtZVxyXG4gICAgICBzb3VyY2VDb2RlRGlyOiAnZnJvbnRlbmQnLCAgICAgICAgICAgICAgLy8gVGhlIGRpcmVjdG9yeSB3aGVyZSB0aGUgc291cmNlIGNvZGUgaXMgbG9jYXRlZFxyXG4gICAgICBlbnRyeXBvaW50c0RpcjogJ2Zyb250ZW5kL2VudHJ5cG9pbnRzJywgLy8gVGhlIGRpcmVjdG9yeSB3aGVyZSB0aGUgZW50cnlwb2ludHMgYXJlIGxvY2F0ZWRcclxuICAgICAgc25pcHBldEZpbGU6ICdlbnRyeS5saXF1aWQnLCAgICAgICAgICAgIC8vIFRoZSBmaWxlIHdoZXJlIHRoZSBzY3JpcHQgdGFnIGlzIGluamVjdGVkXHJcbiAgICAgIGFkZGl0aW9uYWxFbnRyeXBvaW50czogW1xyXG4gICAgICAgIC4uLmdsb2Iuc3luYygnZnJvbnRlbmQvc3R5bGVzL3NlY3Rpb25zLyoqLyouc2NzcycpLCAvLyBTQ1NTIGVudHJ5cG9pbnRzXHJcbiAgICAgICAgLi4uZ2xvYi5zeW5jKCdmcm9udGVuZC9zY3JpcHRzL3NlY3Rpb25zLyoqLyouanMnKSAgIC8vIEphdmFTY3JpcHQgZW50cnlwb2ludHNcclxuICAgICAgXSxcclxuICAgIH0pLFxyXG4gIF0sXHJcbiAgYnVpbGQ6IHtcclxuICAgIG91dERpcjogJ2Fzc2V0cycsIC8vIE91dHB1dCBkaXJlY3RvcnkgZm9yIHRoZSBidWlsZFxyXG4gICAgZW1wdHlPdXREaXI6IHRydWUsIC8vIERvbid0IGRlbGV0ZSB0aGUgb3V0RGlyIGJlZm9yZSBidWlsZGluZ1xyXG4gICAgc291cmNlbWFwOiB0cnVlLCAvLyBFbmFibGUgc291cmNlbWFwc1xyXG4gICAgLy8gcm9sbHVwT3B0aW9uczoge1xyXG4gICAgLy8gICBpbnB1dDoge1xyXG4gICAgLy8gICAgIG1haW46ICAgICAgIHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICdmcm9udGVuZC9lbnRyeXBvaW50cy9tYWluLnRoZW1lLmpzJyksXHJcbiAgICAvLyAgICAgcHJvZHVjdDogICAgcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ2Zyb250ZW5kL2VudHJ5cG9pbnRzL3RoZW1lLnByb2R1Y3QuanMnKSxcclxuICAgIC8vICAgfSxcclxuICAgIC8vICAgb3V0cHV0OiB7XHJcbiAgICAvLyAgICAgZW50cnlGaWxlTmFtZXM6ICdbbmFtZV0uW2hhc2hdLm1pbi5qcycsXHJcbiAgICAvLyAgICAgY2h1bmtGaWxlTmFtZXM6ICdbbmFtZV0uW2hhc2hdLm1pbi5qcycsXHJcbiAgICAvLyAgICAgYXNzZXRGaWxlTmFtZXM6ICdbbmFtZV0uW2hhc2hdLm1pbltleHRuYW1lXScsXHJcbiAgICAvLyAgIH0sXHJcbiAgICAvLyB9LFxyXG4gICAgLy8gc291cmNlbWFwOiBmYWxzZSwgLy8gRW5hYmxlIHNvdXJjZW1hcHNcclxuICB9LFxyXG59KTtcclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFtVSxTQUFTLG9CQUFvQjtBQUNoVyxPQUFPLFVBQVU7QUFDakIsT0FBTyxhQUFhO0FBQ3BCLE9BQU8sYUFBYTtBQUNwQixPQUFPLFVBQVU7QUFKakIsSUFBTSxtQ0FBbUM7QUFNekMsSUFBTyxzQkFBUSxhQUFhO0FBQUE7QUFBQSxFQUUxQixTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxLQUFLLEtBQUssUUFBUSxrQ0FBVyxJQUFJO0FBQUEsTUFDakMsS0FBSyxLQUFLLFFBQVEsa0NBQVcsVUFBVTtBQUFBLElBQ3pDO0FBQUEsRUFDRjtBQUFBLEVBQ0EsS0FBSyxDQUVMO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxRQUFRO0FBQUEsSUFDUixRQUFRO0FBQUEsTUFDTixXQUFXO0FBQUE7QUFBQSxNQUNYLGVBQWU7QUFBQTtBQUFBLE1BQ2YsZ0JBQWdCO0FBQUE7QUFBQSxNQUNoQixhQUFhO0FBQUE7QUFBQSxNQUNiLHVCQUF1QjtBQUFBLFFBQ3JCLEdBQUcsS0FBSyxLQUFLLG9DQUFvQztBQUFBO0FBQUEsUUFDakQsR0FBRyxLQUFLLEtBQUssbUNBQW1DO0FBQUE7QUFBQSxNQUNsRDtBQUFBLElBQ0YsQ0FBQztBQUFBLEVBQ0g7QUFBQSxFQUNBLE9BQU87QUFBQSxJQUNMLFFBQVE7QUFBQTtBQUFBLElBQ1IsYUFBYTtBQUFBO0FBQUEsSUFDYixXQUFXO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxFQWFiO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
