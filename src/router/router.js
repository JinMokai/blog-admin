import { createRouter, createWebHistory } from 'vue-router'
import Home from "@/views/home/home.vue"
import Login from "@/views/login/login.vue"
import NotFound from "@/views/err/404.vue"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: "/",
      name: "home",
      component: Home,
      meta: {
        requiresAuth: true // 需要登录才能访问
      }
    },
    {
      path: '/:catchAll(.*)',
      name: "NotFound",
      component: NotFound // 匹配所有路径
    }
  ]
})
/**
 * 判断是否登录，已经登录就跳到/home,没登陆就回到login
 */
router.beforeEach((to, from, next) => {
  const isLoggedIn = localStorage.getItem('token')
  console.log(to.matched)
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (isLoggedIn) {
      next()
    } else {
      next('/login')
    }
  } else {
    if (isLoggedIn && to.path === '/login') {
      next('/home')
    } else {
      next()
    }
  }
})

export default router
