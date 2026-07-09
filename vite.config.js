import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/baserow-api': {
        target: 'http://localhost:85',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/baserow-api/, '')
      },
      '/n8n-api': {
        target: 'http://localhost:5678',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/n8n-api/, '')
      }
    }
  }
})
