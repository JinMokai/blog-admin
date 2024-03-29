import { createRouter, createWebHistory } from 'vue-router'
import Home from "@/views/home/home.vue"
import Login from "@/views/login/login.vue"
import NotFound from "@/views/err/404.vue"
import User from "@/views/user/user.vue"
import Article from "@/views/article/article.vue"
import Comment from "@/views/comment/comment.vue"
import Message from "@/views/message/message.vue"
import Index from "@/views/home/index.vue"
import Admin from "@/views/user/admin.vue"
import Link from "@/views/link/link.vue"
import Categary from "@/views/categary/categary.vue"
import addArticle from "@/views/article/addArticle.vue"
import editArticle from "@/views/article/editArticle.vue"
import { ElMessage } from 'element-plus'

const router = createRouter({
  history: createWebHistory(), // hash模式
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: {
        title: "登录"
      }
    },
    {
      path: "/home",
      name: "home",
      component: Home,
      redirect: "/home/index",
      meta: {
        requiresAuth: true // 需要登录才能访问
      },
      children: [
        {
          path: "index",
          name: "首页",
          component: Index,
          meta: {
            title: "首页",
          }
        },
        {
          path: "user",
          component: User,
          name: "user",
          meta: {
            title: "用户管理"
          }
        },
        {
          path: "article",
          component: Article,
          name: "article",
          meta: {
            title: "文章管理"
          }
        },
        {
          path: "categary",
          component: Categary,
          name: "Categary",
          meta: {
            title: "分类管理"
          }
        },
        {
          path: "addarticle",
          component: addArticle,
          name: "addarticle",
          meta: {
            title: "新增文章"
          },
        },
        {
          path: "editArticle/:articleId",
          component: editArticle,
          name: "editArticle",
          meta: {
            title: "修改文章"
          }
        },
        {
          path: "comment",
          component: Comment,
          name: "comment",
          meta: {
            title: "评论管理"
          }
        },
        {
          path: "message",
          component: Message,
          name: "message",
          meta: {
            title: "留言管理"
          }
        },
        {
          path: "link",
          component: Link,
          name: "link",
          meta: {
            title: "友链管理"
          }
        },
        {
          path: "admin",
          component: Admin,
          name: "admin",
          meta: {
            title: "个人管理"
          }
        }
      ],
    },
    {
      path: "/",
      redirect: "/login"
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
  if (to.meta.requiresAuth && !isLoggedIn) {
    // 如果该页面需要登录且用户未登录，则跳转到登录页面
    ElMessage({
      message: '请先登录',
      type: 'warning',
      duration: 1500,
      onClose() {
        next({ path: '/login' })
      }
    })
  }

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
