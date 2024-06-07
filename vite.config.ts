import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: "./",
  build: {
    target: 'esnext',
    outDir: "docs",
  },
  assetsInclude: ['**/*.hdr', '**/*.glb'],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  }
});
