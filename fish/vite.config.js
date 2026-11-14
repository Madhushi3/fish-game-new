import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api/marcconrad': {
        target: 'https://marcconrad.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/marcconrad/, ''),
        secure: false,
      },
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
})
