<template>
  <div>
    <Header message="友链管理" />
    <el-form :inline="true" :model="linkInfo" class="link_box">
      <el-form-item label="网站名称" style="font-weight: 600">
        <el-input v-model="linkInfo.site_name" aria-placeholder="请输入网址名称" placeholder="请输入网址名称" />
      </el-form-item>
      <el-form-item label="申请时间">
        <el-date-picker
          v-model="value1"
          type="daterange"
          range-separator="到"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary">
          <el-icon><Search /></el-icon>
          <span>搜索</span>
        </el-button>
        <el-button>
          <el-icon><Refresh /></el-icon>
          <span>重置</span>
        </el-button>
      </el-form-item>
    </el-form>
    <el-form-item style="margin-bottom: 1rem; padding-left: 24px">
      <el-button type="danger" size="small">
        <el-icon><Delete /></el-icon>
        批量删除
      </el-button>
    </el-form-item>
    <!-- <el-table :data="linkList" style="width: 100%" v-loading="loading" height="352px"> </el-table> -->
    <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick" style="padding-left: 24px;">
      <el-tab-pane label="所有友链" name="1">User</el-tab-pane>
      <el-tab-pane label="待审核" name="2">Config</el-tab-pane>
      <el-tab-pane label="审核通过" name="3">Role</el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Header from "@/components/header.vue";
export default {
  data() {
    return {
      linkList: [],
      linkInfo: {},
      activeName: '1' // tab标签默认关联
    };
  },
  created() {},
  methods: {
    // 获取所有友链列表
    async getLinkList() {},
  },
  components: {
    Header,
  },
};
</script>

<style scoped>
.link_box {
  padding: 24px;
  padding-bottom: 0;
}
</style>
