import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

const manifestForPlugin = {
  registerType: 'autoUpdate',
  includeAssets: ['react.svg', 'apple-touch-icon.png'],
  strategies: 'generateSW',
  manifest: {
    name: 'SentinelKey - Gestor de contraseñas',
    short_name: 'SentineKey',
    description: 'Un gestor simple',
    theme_color: '#1a1a1a',
    background_color: '#1a1a1a',
    start_url: '/',
    scope: '/',
    display_override: ["minimal-ui"],
    display: 'minimal-ui',
    orientation: 'portrait',
    protocol_handlers: [
      {
      "protocol": "web+https",
      "url": "/https?type=%s"
    },
    {
      "protocol": "web+coffee",
      "url": "/coffee?type=%s"
    }],
    icons: [
          {
            src: 'react.svg',
            sizes: '192x192',
            type: 'image/png'
          }
        ]
  },
  workbox: {
    globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
    runtimeCaching: [
      {
        urlPattern: /^https:\/\/mi-api.com\/tareas/,
        handler: 'CacheFirst',
        options: {
          cacheName: 'api-cache',
          expiration: {
            maxEntries: 50,
            maxAgeSeconds: 60 * 60 * 24, // 1 día
          },
        },
      },
    ],
  },
  devOptions: {
    enabled: true,
    navigateFallback: 'index.html'
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA(manifestForPlugin)],
    server: {
      host: true,
      https: false
    },
    build: {
      sourcemap: true
    }
})
