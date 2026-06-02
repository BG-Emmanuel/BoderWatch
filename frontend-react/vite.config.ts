import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
export default defineConfig({
  plugins: [react()],
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
  server: {
    port: 5173,
    proxy: {
      '/api/v1/auth': { target: 'http://localhost:8081', changeOrigin: true },
      '/api/v1/users': { target: 'http://localhost:8081', changeOrigin: true },
      '/api/v1/trucks': { target: 'http://localhost:8081', changeOrigin: true },
      '/api/v1/telemetry': { target: 'http://localhost:8081', changeOrigin: true },
      '/api/v1/corridors': { target: 'http://localhost:8081', changeOrigin: true },
      '/api/v1/compliance': { target: 'http://localhost:8083', changeOrigin: true },
      '/api/v1/tracking': { target: 'http://localhost:8082', changeOrigin: true },
      '/health': { target: 'http://localhost:8081', changeOrigin: true, rewrite: path => '/actuator/health' },
    },
  },
  build: { outDir: 'dist', sourcemap: false },
});
