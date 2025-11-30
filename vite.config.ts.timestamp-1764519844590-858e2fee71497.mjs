// vite.config.ts
import { defineConfig } from "file:///Users/macbook/Downloads/yuum/node_modules/vite/dist/node/index.js";
import path from "path";
import shopify from "file:///Users/macbook/Downloads/yuum/node_modules/vite-plugin-shopify/dist/index.js";
import cleanup from "file:///Users/macbook/Downloads/yuum/node_modules/@by-association-only/vite-plugin-shopify-clean/dist/index.mjs";
import glob from "file:///Users/macbook/Downloads/yuum/node_modules/fast-glob/out/index.js";
var __vite_injected_original_dirname = "/Users/macbook/Downloads/yuum";
var vite_config_default = defineConfig({
  resolve: {
    alias: {
      "~": path.resolve(__vite_injected_original_dirname, "./"),
      "@": path.resolve(__vite_injected_original_dirname, "frontend")
    }
  },
  server: {
    host: "127.0.0.1",
    port: 5173,
    strictPort: true,
    cors: true,
    origin: "http://127.0.0.1:5173",
    hmr: {
      protocol: "ws",
      host: "127.0.0.1",
      port: 5173
    },
    fs: { strict: false }
  },
  optimizeDeps: {
    include: ["@studio-freight/lenis"]
  },
  plugins: [
    cleanup(),
    shopify({
      themeRoot: "./",
      sourceCodeDir: "frontend",
      entrypointsDir: "frontend/entrypoints",
      snippetFile: "entry.liquid",
      additionalEntrypoints: [
        ...glob.sync("frontend/styles/sections/**/*.scss"),
        ...glob.sync("frontend/scripts/sections/**/*.js")
      ]
    })
  ],
  build: {
    outDir: "assets",
    emptyOutDir: true,
    sourcemap: true
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvbWFjYm9vay9Eb3dubG9hZHMveXV1bVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL21hY2Jvb2svRG93bmxvYWRzL3l1dW0vdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL21hY2Jvb2svRG93bmxvYWRzL3l1dW0vdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHNob3BpZnkgZnJvbSAndml0ZS1wbHVnaW4tc2hvcGlmeSc7XG5pbXBvcnQgY2xlYW51cCBmcm9tICdAYnktYXNzb2NpYXRpb24tb25seS92aXRlLXBsdWdpbi1zaG9waWZ5LWNsZWFuJztcbmltcG9ydCBnbG9iIGZyb20gJ2Zhc3QtZ2xvYic7XG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHJlc29sdmU6IHtcbiAgICBhbGlhczoge1xuICAgICAgJ34nOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi8nKSxcbiAgICAgICdAJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ2Zyb250ZW5kJyksXG4gICAgfSxcbiAgfSxcbiAgc2VydmVyOiB7XG4gICAgaG9zdDogJzEyNy4wLjAuMScsXG4gICAgcG9ydDogNTE3MyxcbiAgICBzdHJpY3RQb3J0OiB0cnVlLFxuICAgIGNvcnM6IHRydWUsXG4gICAgb3JpZ2luOiAnaHR0cDovLzEyNy4wLjAuMTo1MTczJyxcbiAgICBobXI6IHtcbiAgICAgIHByb3RvY29sOiAnd3MnLFxuICAgICAgaG9zdDogJzEyNy4wLjAuMScsXG4gICAgICBwb3J0OiA1MTczLFxuICAgIH0sXG4gICAgZnM6IHsgc3RyaWN0OiBmYWxzZSB9LFxuICB9LFxuICBvcHRpbWl6ZURlcHM6IHtcbiAgICBpbmNsdWRlOiBbJ0BzdHVkaW8tZnJlaWdodC9sZW5pcyddLFxuICB9LFxuICBwbHVnaW5zOiBbXG4gICAgY2xlYW51cCgpLFxuICAgIHNob3BpZnkoe1xuICAgICAgdGhlbWVSb290OiAnLi8nLFxuICAgICAgc291cmNlQ29kZURpcjogJ2Zyb250ZW5kJyxcbiAgICAgIGVudHJ5cG9pbnRzRGlyOiAnZnJvbnRlbmQvZW50cnlwb2ludHMnLFxuICAgICAgc25pcHBldEZpbGU6ICdlbnRyeS5saXF1aWQnLFxuICAgICAgYWRkaXRpb25hbEVudHJ5cG9pbnRzOiBbXG4gICAgICAgIC4uLmdsb2Iuc3luYygnZnJvbnRlbmQvc3R5bGVzL3NlY3Rpb25zLyoqLyouc2NzcycpLFxuICAgICAgICAuLi5nbG9iLnN5bmMoJ2Zyb250ZW5kL3NjcmlwdHMvc2VjdGlvbnMvKiovKi5qcycpLFxuICAgICAgXSxcbiAgICB9KSxcbiAgXSxcbiAgYnVpbGQ6IHtcbiAgICBvdXREaXI6ICdhc3NldHMnLFxuICAgIGVtcHR5T3V0RGlyOiB0cnVlLFxuICAgIHNvdXJjZW1hcDogdHJ1ZSxcbiAgfSxcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUF5USxTQUFTLG9CQUFvQjtBQUN0UyxPQUFPLFVBQVU7QUFDakIsT0FBTyxhQUFhO0FBQ3BCLE9BQU8sYUFBYTtBQUNwQixPQUFPLFVBQVU7QUFKakIsSUFBTSxtQ0FBbUM7QUFNekMsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsS0FBSyxLQUFLLFFBQVEsa0NBQVcsSUFBSTtBQUFBLE1BQ2pDLEtBQUssS0FBSyxRQUFRLGtDQUFXLFVBQVU7QUFBQSxJQUN6QztBQUFBLEVBQ0Y7QUFBQSxFQUNBLFFBQVE7QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLFlBQVk7QUFBQSxJQUNaLE1BQU07QUFBQSxJQUNOLFFBQVE7QUFBQSxJQUNSLEtBQUs7QUFBQSxNQUNILFVBQVU7QUFBQSxNQUNWLE1BQU07QUFBQSxNQUNOLE1BQU07QUFBQSxJQUNSO0FBQUEsSUFDQSxJQUFJLEVBQUUsUUFBUSxNQUFNO0FBQUEsRUFDdEI7QUFBQSxFQUNBLGNBQWM7QUFBQSxJQUNaLFNBQVMsQ0FBQyx1QkFBdUI7QUFBQSxFQUNuQztBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsUUFBUTtBQUFBLElBQ1IsUUFBUTtBQUFBLE1BQ04sV0FBVztBQUFBLE1BQ1gsZUFBZTtBQUFBLE1BQ2YsZ0JBQWdCO0FBQUEsTUFDaEIsYUFBYTtBQUFBLE1BQ2IsdUJBQXVCO0FBQUEsUUFDckIsR0FBRyxLQUFLLEtBQUssb0NBQW9DO0FBQUEsUUFDakQsR0FBRyxLQUFLLEtBQUssbUNBQW1DO0FBQUEsTUFDbEQ7QUFBQSxJQUNGLENBQUM7QUFBQSxFQUNIO0FBQUEsRUFDQSxPQUFPO0FBQUEsSUFDTCxRQUFRO0FBQUEsSUFDUixhQUFhO0FBQUEsSUFDYixXQUFXO0FBQUEsRUFDYjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
