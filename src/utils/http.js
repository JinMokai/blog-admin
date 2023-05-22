import axios from 'axios'
import { ElMessage } from 'element-plus'

const instance = axios.create({
    baseURL: import.meta.env.VITE_APIURL,
    timeout: 1000 * 60 // 超时时间为 1 分钟
})

// 添加请求拦截器
instance.interceptors.request.use(
    config => {
        // 如果不是登录请求，则将 token 添加到请求头中
        if (config.url !== '/user/login') {
            const token = localStorage.getItem('token') || ''
            if (token) {
                config.headers.Authorization = `Bearer ${token}`
            }
        }
        return config
    },
    error => {
        // 对请求错误做些什么
        return Promise.reject(error)
    }
)

// 添加响应拦截器
instance.interceptors.response.use(
    response => {
        return response.data
    },
    error => {
        // 如果响应拦截器返回code:1002表示token过期
        const { code, message } = error.response.data
        if (code == 1002) {
            console.error("登录过期！请重新登录！")
            ElMessage({
                message: '登录已过期，请重新登录',
                type: 'error',
                duration: 1500,
                onClose() {
                    // 执行一些其他的操作，例如清除本地存储的用户信息
                    localStorage.removeItem('token')
                    localStorage.removeItem('user')

                    // 跳转到登录页面
                    window.location.href = '/login'
                }
            })
        }
        // 对响应错误做点什么，例如：弹出错误提示
        return Promise.reject(error)
    }
)

export default instance