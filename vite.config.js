import { fileURLToPath, URL } from 'node:url'
const path = require("path")

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      imports: ['vue'],
      resolvers: [
        ElementPlusResolver(),
        // Auto import icon components
        // 自动导入图标组件
        IconsResolver({
          prefix: 'Icon',
        }),
      ],
    }),
    Components({
      resolvers: [
        // Auto register icon components
        // 自动注册图标组件
        IconsResolver({
          enabledCollections: ['ep'],
        }),
        // Auto register Element Plus components
        // 自动导入 Element Plus 组件
        ElementPlusResolver()
      ],
    }),
    Icons({
      autoInstall: true,
    }),
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
