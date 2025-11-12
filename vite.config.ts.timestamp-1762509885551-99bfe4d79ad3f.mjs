// vite.config.ts
import { defineConfig } from "file:///D:/project/shopify-com/yuum/node_modules/vite/dist/node/index.js";
import path from "path";
import shopify from "file:///D:/project/shopify-com/yuum/node_modules/vite-plugin-shopify/dist/index.js";
import cleanup from "file:///D:/project/shopify-com/yuum/node_modules/@by-association-only/vite-plugin-shopify-clean/dist/index.mjs";
import glob from "file:///D:/project/shopify-com/yuum/node_modules/fast-glob/out/index.js";
var __vite_injected_original_dirname = "D:\\project\\shopify-com\\yuum";
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxwcm9qZWN0XFxcXHNob3BpZnktY29tXFxcXHl1dW1cIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXHByb2plY3RcXFxcc2hvcGlmeS1jb21cXFxceXV1bVxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovcHJvamVjdC9zaG9waWZ5LWNvbS95dXVtL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XHJcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xyXG5pbXBvcnQgc2hvcGlmeSBmcm9tICd2aXRlLXBsdWdpbi1zaG9waWZ5JztcclxuaW1wb3J0IGNsZWFudXAgZnJvbSAnQGJ5LWFzc29jaWF0aW9uLW9ubHkvdml0ZS1wbHVnaW4tc2hvcGlmeS1jbGVhbic7XHJcbmltcG9ydCBnbG9iIGZyb20gJ2Zhc3QtZ2xvYic7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xyXG4gIHJlc29sdmU6IHtcclxuICAgIGFsaWFzOiB7XHJcbiAgICAgICd+JzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4vJyksXHJcbiAgICAgICdAJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ2Zyb250ZW5kJyksXHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgc2VydmVyOiB7XHJcbiAgICBob3N0OiAnMTI3LjAuMC4xJyxcclxuICAgIHBvcnQ6IDUxNzMsXHJcbiAgICBzdHJpY3RQb3J0OiB0cnVlLFxyXG4gICAgY29yczogdHJ1ZSxcclxuICAgIG9yaWdpbjogJ2h0dHA6Ly8xMjcuMC4wLjE6NTE3MycsXHJcbiAgICBobXI6IHtcclxuICAgICAgcHJvdG9jb2w6ICd3cycsXHJcbiAgICAgIGhvc3Q6ICcxMjcuMC4wLjEnLFxyXG4gICAgICBwb3J0OiA1MTczLFxyXG4gICAgfSxcclxuICAgIGZzOiB7IHN0cmljdDogZmFsc2UgfSxcclxuICB9LFxyXG4gIG9wdGltaXplRGVwczoge1xyXG4gICAgaW5jbHVkZTogWydAc3R1ZGlvLWZyZWlnaHQvbGVuaXMnXSxcclxuICB9LFxyXG4gIHBsdWdpbnM6IFtcclxuICAgIGNsZWFudXAoKSxcclxuICAgIHNob3BpZnkoe1xyXG4gICAgICB0aGVtZVJvb3Q6ICcuLycsXHJcbiAgICAgIHNvdXJjZUNvZGVEaXI6ICdmcm9udGVuZCcsXHJcbiAgICAgIGVudHJ5cG9pbnRzRGlyOiAnZnJvbnRlbmQvZW50cnlwb2ludHMnLFxyXG4gICAgICBzbmlwcGV0RmlsZTogJ2VudHJ5LmxpcXVpZCcsXHJcbiAgICAgIGFkZGl0aW9uYWxFbnRyeXBvaW50czogW1xyXG4gICAgICAgIC4uLmdsb2Iuc3luYygnZnJvbnRlbmQvc3R5bGVzL3NlY3Rpb25zLyoqLyouc2NzcycpLFxyXG4gICAgICAgIC4uLmdsb2Iuc3luYygnZnJvbnRlbmQvc2NyaXB0cy9zZWN0aW9ucy8qKi8qLmpzJyksXHJcbiAgICAgIF0sXHJcbiAgICB9KSxcclxuICBdLFxyXG4gIGJ1aWxkOiB7XHJcbiAgICBvdXREaXI6ICdhc3NldHMnLFxyXG4gICAgZW1wdHlPdXREaXI6IHRydWUsXHJcbiAgICBzb3VyY2VtYXA6IHRydWUsXHJcbiAgfSxcclxufSk7XHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBMlEsU0FBUyxvQkFBb0I7QUFDeFMsT0FBTyxVQUFVO0FBQ2pCLE9BQU8sYUFBYTtBQUNwQixPQUFPLGFBQWE7QUFDcEIsT0FBTyxVQUFVO0FBSmpCLElBQU0sbUNBQW1DO0FBTXpDLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQUssS0FBSyxRQUFRLGtDQUFXLElBQUk7QUFBQSxNQUNqQyxLQUFLLEtBQUssUUFBUSxrQ0FBVyxVQUFVO0FBQUEsSUFDekM7QUFBQSxFQUNGO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixZQUFZO0FBQUEsSUFDWixNQUFNO0FBQUEsSUFDTixRQUFRO0FBQUEsSUFDUixLQUFLO0FBQUEsTUFDSCxVQUFVO0FBQUEsTUFDVixNQUFNO0FBQUEsTUFDTixNQUFNO0FBQUEsSUFDUjtBQUFBLElBQ0EsSUFBSSxFQUFFLFFBQVEsTUFBTTtBQUFBLEVBQ3RCO0FBQUEsRUFDQSxjQUFjO0FBQUEsSUFDWixTQUFTLENBQUMsdUJBQXVCO0FBQUEsRUFDbkM7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLFFBQVE7QUFBQSxJQUNSLFFBQVE7QUFBQSxNQUNOLFdBQVc7QUFBQSxNQUNYLGVBQWU7QUFBQSxNQUNmLGdCQUFnQjtBQUFBLE1BQ2hCLGFBQWE7QUFBQSxNQUNiLHVCQUF1QjtBQUFBLFFBQ3JCLEdBQUcsS0FBSyxLQUFLLG9DQUFvQztBQUFBLFFBQ2pELEdBQUcsS0FBSyxLQUFLLG1DQUFtQztBQUFBLE1BQ2xEO0FBQUEsSUFDRixDQUFDO0FBQUEsRUFDSDtBQUFBLEVBQ0EsT0FBTztBQUFBLElBQ0wsUUFBUTtBQUFBLElBQ1IsYUFBYTtBQUFBLElBQ2IsV0FBVztBQUFBLEVBQ2I7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
