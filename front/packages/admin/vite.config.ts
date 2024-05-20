import path from 'path';
import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import basicSsl from '@vitejs/plugin-basic-ssl';
import cesium from "vite-plugin-cesium";

// https://vitejs.dev/config/
export default defineConfig({
  base: '/geomatic-admin/',
  plugins: [
    react(),
    basicSsl(),
    cesium()
  ],
  server: {
    port: 3001,
    open: true,
    https: true,
  },
  resolve: {
    conditions: [],
    alias: {
      "@src": path.resolve(__dirname, "./src"),
    },
  },

})
