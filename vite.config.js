import { fileURLToPath, URL } from 'node:url'
const path = require("path")

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue()
  ],
  resolve: {
    // 别名最好配置jsconfig.json文件，让vscode可以识别跳转
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  // server: {
  //   Proxy: {
  //     '/api': {
  //       target: 'http://localhost:8888',
  //       changeOrigin: true,
  //       rewrite: path => path.replace(/^\/api/, '') // 替换路径/api变为空
  //     },
  //   }
  // }
})
