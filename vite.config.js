import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,  // listen on all network interfaces
    port: 5173,  // default Vite port
  },
  build: {
    minify: 'esbuild', // faster than terser
    sourcemap: false,  // optional, disables source maps for faster build
  },
});
