import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwind from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            { name: 'framework', test: /\/node_modules\/(react|react-dom|react-router|react-router-dom|scheduler)\// },
            { debugName: 'curriculum', name: (id) => id.match(/\/src\/content\/([a-z0-9-]+)\.ts$/)?.[1] },
          ],
        },
      },
    },
  },
  plugins: [
    react(),
    tailwind(),
    VitePWA({
      registerType: 'prompt',
      injectRegister: null,
      manifest: {
        name: 'Fluent Blocks · ฝึกพูดภาษาอังกฤษ',
        short_name: 'Fluent Blocks',
        lang: 'th',
        start_url: '/',
        display: 'standalone',
        background_color: '#0B0D10',
        theme_color: '#0B0D10',
        icons: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
        ],
      },
      workbox: { clientsClaim: true, globPatterns: ['**/*.{html,js,css,json,woff2,png,svg}'], navigateFallback: '/index.html' },
    }),
  ],
})
