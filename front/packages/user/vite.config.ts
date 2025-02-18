import path from 'path';
import {defineConfig} from 'vite';
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
      "/api/vworld": {
        target: "https://api.vworld.kr",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/vworld/, "/req/wms"),
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
