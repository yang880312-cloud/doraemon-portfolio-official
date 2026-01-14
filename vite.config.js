import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'node:path'

// Use process.cwd() to avoid URL encoding issues with Chinese paths on Windows
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(process.cwd(), 'src')
    }
  },
  build: {
    minify: false
  }
})
