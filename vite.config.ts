import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/.*\.supabase\.co\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'supabase-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 // 24 hours
              }
            }
          }
        ]
      },
      includeAssets: ['favicon.ico', 'admin-icon-192.svg', 'admin-icon-512.svg'],
      manifest: {
        name: 'Noivas Cirlene - Sistema Administrativo',
        short_name: 'Admin Noivas',
        description: 'Sistema administrativo para gestão de aluguéis de vestidos de noiva',
        theme_color: '#8B5A3C',
        background_color: '#FAF7F4',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/admin',
        start_url: '/admin',
        icons: [
          {
            src: 'admin-icon-192.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          },
          {
            src: 'admin-icon-512.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ],
        categories: ['business', 'productivity'],
        shortcuts: [
          {
            name: 'Aluguéis',
            short_name: 'Aluguéis',
            description: 'Gerenciar aluguéis e reservas',
            url: '/admin/rentals',
            icons: [{ src: 'admin-icon-192.svg', sizes: '192x192' }]
          },
          {
            name: 'Calendário',
            short_name: 'Agenda',
            description: 'Visualizar agenda de eventos',
            url: '/admin/calendar',
            icons: [{ src: 'admin-icon-192.svg', sizes: '192x192' }]
          },
          {
            name: 'Clientes',
            short_name: 'Clientes',
            description: 'Gerenciar clientes',
            url: '/admin/customers',
            icons: [{ src: 'admin-icon-192.svg', sizes: '192x192' }]
          }
        ]
      }
    })
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
