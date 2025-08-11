import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate', // Automatically update service worker
      manifest: {
        name: 'OCD Cyclist',
        short_name: 'OCD',
        description: 'OCD cycling data',
        theme_color: '#1976d2',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            "src": "/icons/Square44x44Logo.altform-lightunplated_targetsize-16.png",
            "type": "image/png",
            "sizes": "44x44"
          },
          {
            "src": "/icons/Square150x150Logo.scale-100.png",
            "type": "image/png",
            "sizes": "150x150"
          }
        ]
      }
    }),
  ],
});
