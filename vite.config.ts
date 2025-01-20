import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { viteStaticCopy } from 'vite-plugin-static-copy';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: 'src/docs/Utilities.xlsx',
          dest: 'docs'
        }
      ]
    })
  ],
  resolve: {
    alias: [{ find: "@", replacement: path.resolve(__dirname, "src") }],
  },
  assetsInclude: ['**/*.xlsx'], // Add this line to include `.xlsx` files as assets

  server: {
    port: 3010
  }
});
