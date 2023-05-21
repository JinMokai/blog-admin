import './assets/main.css'

import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import App from './App.vue'
import router from './router/router'
import Store from "./store/Stroage"
import http from "./utils/http"

const app = createApp(App)

app.use(router)
app.use(Store)
app.use(ElementPlus)
// vue3写法 将http公共方法挂在到vue实例$http中
app.config.globalProperties.$http = http
console.log(app)

app.mount('#app')
