import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import basicSsl from "@vitejs/plugin-basic-ssl";
import cesium from 'vite-plugin-cesium';

// https://vitejs.dev/config/
export default defineConfig({
  base: "/user/",
  plugins: [
    react(),
    basicSsl(),
    cesium()
  ],
  server: {
    port: 3002,
    open: true,
    https: true,
    proxy: {
      "/user/vworld/wms": {
        target: "https://api.vworld.kr",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/user\/vworld\/wms/, "/req/wms"),
        secure: false,
      },
      "/user/vworld/search": {
        target: "https://api.vworld.kr",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/user\/vworld\/search/, "/req/search"),
        secure: false,
      },
      "/cesium": {
        target: "https://localhost:3002",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/cesium/, "/user/cesium"),
        secure: false,
      },
    },
  },
  resolve: {
    conditions: [],
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
