import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

let devToolsPlugin = []

if (process.env.NODE_ENV === 'development') {
  try {
    const vueDevTools = await import('vite-plugin-vue-devtools')
    devToolsPlugin = [vueDevTools.default()]
  } catch (err) {
    console.warn('⚠️ vue-devtools not loaded in production build')
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    ...devToolsPlugin, 
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
 
  preview: {
    host: '0.0.0.0',
    port: 10000,
    allowedHosts: ['https://five032-assignment.onrender.com'], 
  },
})