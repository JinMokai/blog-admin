<template>
  <div class="common-layout">
    <el-container class="container">
      <el-aside width="200px" class="aside">
        <div class="side_logo">
          <a href="" title="小金的博客后台">
            <span class="blogname">小金的博客后台</span>
          </a>
        </div>
        <el-menu
          :default-active="$route.path"
          background-color="#001529"
          text-color="#fff"
          active-text-color="#ffd04b"
          @select="selectItem"
        >
          <el-menu-item index="/home/index">
            <el-icon>
              <Memo />
            </el-icon>
            <template #title>首页</template>
          </el-menu-item>
          <el-menu-item index="/home/user">
            <el-icon>
              <User />
            </el-icon>
            <template #title>用户管理</template>
          </el-menu-item>
          <el-sub-menu>
            <template #title>
              <el-icon><Tickets /></el-icon>
              <span>文章管理</span>
            </template>
            <el-menu-item index="/home/article"> 文章管理 </el-menu-item>
            <el-menu-item index="/home/addarticle"> 新增文章 </el-menu-item>
            <el-menu-item index="/home/categary"> 分类管理 </el-menu-item>
          </el-sub-menu>
          <el-menu-item index="/home/comment">
            <el-icon>
              <ChatDotRound />
            </el-icon>
            <template #title>评论管理</template>
          </el-menu-item>
          <el-menu-item index="/home/message">
            <el-icon>
              <ChatRound />
            </el-icon>
            <template #title>留言管理</template>
          </el-menu-item>
          <el-menu-item index="/home/link">
            <el-icon>
              <Link />
            </el-icon>
            <template #title>友链管理</template>
          </el-menu-item>
          <el-menu-item index="/home/admin">
            <el-icon><Avatar /></el-icon>
            <template #title>个人管理</template>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header class="header">
          <el-breadcrumb separator="/" style="line-height: 60px">
            <el-breadcrumb-item :to="{ path: '/' }">博客后台</el-breadcrumb-item>
            <el-breadcrumb-item :to="$route.path">{{ $route.meta.title || $route.name }}</el-breadcrumb-item>
            <!-- 动态渲染二级菜单 -->
            <el-breadcrumb-item v-if="$route.meta.parentTitle">{{ $route.meta.parentTitle }}</el-breadcrumb-item>
            <el-breadcrumb-item v-if="$route.meta.title">{{ $route.meta.title }}</el-breadcrumb-item>
          </el-breadcrumb>
          <el-button type="primary" class="header_btn" @click="clearUser">注销</el-button>
        </el-header>
        <el-main class="main">
          <router-view></router-view>
        </el-main>
        <el-footer class="footer">© 2023 Copyright jinkai. Made in China use Vue3 ❤️</el-footer>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  created() {},
  methods: {
    // 注销登录
    clearUser() {
      localStorage.clear();
      this.$message({
        message: "登出成功",
        type: "success",
        duration: 1500,
      });
      this.$router.push("/login");
    },
    selectItem(index) {
      this.$router.push(index);
    },
  },
};
</script>

<style scoped>
.container {
  width: 100%;
  height: 100vh;
  position: absolute;
}

.aside {
  background-color: #001529;
  color: #a5acb3;
}

.side_logo {
  padding: 1em;
  box-sizing: border-box;
  height: 60px;
}

.blogname {
  color: #1890ff;
  font-size: 20px;
  font-weight: 600;
  margin-top: 10px;
}

.header {
  display: flex;
  justify-content: space-between;
  line-height: 60px;
  border-bottom: 1px solid #e6e6e6;
}

.header_btn {
  margin-top: 8px;
}

/* .main {
  padding: 0;
  margin: 24px;
  box-shadow: rgba(0, 0, 0, 0.12) 0px 0px 12px 0px;
} */

.footer {
  height: 1em;
  text-align: center;
}
</style>
