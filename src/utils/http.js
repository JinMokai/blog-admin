import axios from 'axios'


const instance = axios.create({
    baseURL: import.meta.env.VITE_APIURL,
    timeout: 1000 * 60 // 超时时间为 1 分钟
})

// 添加请求拦截器
instance.interceptors.request.use(
    config => {
        // 如果不是登录请求，则将 token 添加到请求头中
        if (config.url !== '/login') {
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
        // 对响应数据做点什么，例如：返回数据的 data 字段
        return response.data
    },
    error => {
        // 对响应错误做点什么，例如：弹出错误提示
        return Promise.reject(error)
    }
)

export default instance