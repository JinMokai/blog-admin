import './assets/main.css'

import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import 'element-plus/dist/index.css'

import App from './App.vue'
import router from './router/router'
import Store from "./store/Stroage"
import http from "./utils/http"
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App)

app.use(router)
app.use(Store)
app.use(ElementPlus,{
  locale: zhCn,
})
// vue3写法 将http公共方法挂在到vue实例$http中
app.config.globalProperties.$http = http

// 全局注册icon图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.mount('#app')
