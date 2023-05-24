<template>
  <div>
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>留言管理</span>
        </div>
      </template>
      <!-- 表单 -->
      <el-form>
        <el-form-item style="margin-bottom: 1rem; padding-left: 24px">
          <el-button type="danger" size="small" @click="messageDelete">
            <el-icon><Delete /></el-icon>
            批量删除
          </el-button>
          <el-button type="primary" size="small" @click="messageCheck">
            <el-icon><Finished /></el-icon>
            批量审核
          </el-button>
        </el-form-item>
      </el-form>
      <!-- 表格 -->
      <el-table
        :data="messageList"
        style="width: 100%"
        v-loading="loading"
        @selection-change="handleSelectionChange"
        height="352px"
        border
      >
        <el-table-column type="selection" width="55" />
        <el-table-column type="index" label="序号" width="50" />
        <el-table-column prop="nickname" label="昵称" width="100" show-overflow-tooltip />
        <el-table-column prop="email" label="邮箱" width="100" show-overflow-tooltip />
        <el-table-column prop="website" label="网站" width="220" />
        <el-table-column prop="status" label="审核状态" width="100" />
        <el-table-column prop="created" label="创建时间" width="200" />
        <el-table-column prop="updated" label="更新时间" width="200" />
        <el-table-column fixed="right" label="操作" width="120">
          <template #default="scope">
            <el-button :icon="Edit" link type="primary" size="small" @click="handleRowClick(scope.row)">
              <el-icon>
                <EditPen />
              </el-icon>
              修改</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    this.getMessageAll();
  },
  data() {
    return {
      messageList: [],
      // 留言参数(默认)
      messageParams: {
        current: 1,
        size: 10,
      },
      total: 0,
    };
  },
  methods: {
    // 获取所有留言
    async getMessageAll() {
      try {
        let {result} = await this.$http.post("/message/getMessageList", this.messageParams);
        this.total = result.total;
        this.messageList = result.list;
      } catch (err) {
        this.$message({
          type: "error",
          message: "获取所有留言失败",
        });
      }
    },
  },
};
</script>

<style scoped></style>
