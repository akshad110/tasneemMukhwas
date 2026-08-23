import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Framer bundles overflow react-refresh's computeFullKey — force full reload
      exclude: [/_framer-runtime\.js$/, /\/framer\/[^/]+\.js$/],
    }),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    include: ['three'],
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('framer-motion')) return 'framer-motion'
            if (id.includes('lenis')) return 'lenis'
            if (id.includes('gsap')) return 'gsap'
            if (id.includes('/three/') || id.includes('node_modules/three')) return 'three'
            if (id.includes('lucide-react')) return 'icons'
            if (id.includes('@radix-ui')) return 'radix'
            return 'vendor'
          }
          if (id.includes('/components/framer/') || id.includes('_framer-runtime')) {
            return 'framer'
          }
        },
      },
    },
    chunkSizeWarningLimit: 700,
  },
})
