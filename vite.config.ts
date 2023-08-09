import legacy from '@vitejs/plugin-legacy'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    legacy(),
    VitePWA({ 
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'favicon.png'],
      registerType: 'autoUpdate',
      manifest: {
        start_url: '/',
        name: 'Sibaro',
        short_name: 'Sibaro',
        description: 'Sibaro Installation Helper',
        orientation: 'portrait-primary',
        theme_color: '#000000',
        background_color: '#000000',
      },
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  }
})
