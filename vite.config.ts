import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [react(), VitePWA({
    registerType: 'prompt',
    includeAssets: ['icon-192.png', 'icon-512.png'],
    manifest: {
      name: 'EOS GUIDE — Eos操作ガイド', short_name: 'EOS GUIDE', lang: 'ja',
      description: '卓の横で、すぐ確認できるEos操作ガイド',
      start_url: './', scope: './', display: 'standalone',
      background_color: '#111315', theme_color: '#111315',
      icons: [192, 512].map(size => ({ src: `icon-${size}.png`, sizes: `${size}x${size}`, type: 'image/png', purpose: 'any maskable' })),
    },
    workbox: { globPatterns: ['**/*.{js,css,html,png,svg,json}'], navigateFallback: 'index.html' },
  })],
});
