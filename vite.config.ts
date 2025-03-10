import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// import { resolve } from 'path';
import { viteStaticCopy } from 'vite-plugin-static-copy';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: 'popup.html',
          dest: './'
        }
      ]
    })
  ],
  build: {
    outDir: 'MemeRadar',
    rollupOptions: {
      // input: {
      //   main: resolve(__dirname, 'index.html'),
      //   popup: resolve(__dirname, 'popup.html')
      // },
      output: {
        chunkFileNames: 'static/[name].js',
        entryFileNames: 'static/[name].js',
        assetFileNames: 'static/[name].[ext]',
      },
    },
    minify: false
  }
})
