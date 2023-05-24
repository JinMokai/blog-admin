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
          <!-- <el-button type="danger" size="small" @click="messageDelete">
            <el-icon><Delete /></el-icon>
            批量删除
          </el-button> -->
          <!-- <el-button type="primary" size="small" @click="messageCheck">
            <el-icon><Finished /></el-icon>
            批量审核
          </el-button> -->
        </el-form-item>
      </el-form>
      <!-- 表格 -->
      <el-table :data="messageList" style="width: 100%" v-loading="loading" max-height="452px" border>
        <el-table-column type="index" label="序号" width="50" />
        <el-table-column prop="nickname" label="昵称" width="100" show-overflow-tooltip />
        <el-table-column prop="email" label="邮箱" width="100" show-overflow-tooltip />
        <el-table-column prop="website" label="网站" width="220" align="center" show-overflow-tooltip>
          <template #default="{ row }">
            {{ row.website == null ? "暂无网址" : row.website }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="审核状态" width="200" align="center">
          <template #default="scope">
            <el-switch
              v-model="scope.row.status"
              size="large"
              active-text="通过"
              inactive-text="不通过"
              :active-value="'1'"
              :inactive-value="'0'"
              @change="statusChange(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="created" label="创建时间" width="200" />
        <el-table-column prop="updated" label="更新时间" width="200" />
        <el-table-column fixed="right" label="操作" width="100" align="center">
          <template #default="scope">
            <el-button :icon="Edit" link type="danger" size="small" @click="handleRowClick(scope.row)">
              <el-icon>
                <Delete />
              </el-icon>
              删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          v-model:current-page="messageParams.current"
          :page-sizes="[5, 10, 15, 20]"
          :page-size="messageParams.size"
          :small="pagination.small"
          :disabled="disabled"
          :background="pagination.background"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    <!-- 对话框 -->
    <el-dialog v-model="dialogDelete" width="40%" title="提示" top="25vh">
      <span>是否删除？</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogDelete = false">取消</el-button>
          <el-button type="primary" @click="deleteMessage"> 确定 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
export default {
  created() {
    this.getMessageAll();
  },
  data() {
    return {
      messageList: [], // 所有留言
      // 留言参数(默认)
      messageParams: {
        current: 1,
        size: 10,
      },
      total: 0, // 数据总数
      dialogDelete: false, // 删除模块框
      deleteParams: {}, // 删除参数
      pagination: {
        // 分页
        background: true,
        small: true,
      },
    };
  },
  methods: {
    // 获取所有留言
    async getMessageAll() {
      try {
        let { result } = await this.$http.post("/message/getMessageList", this.messageParams);
        this.total = result.total;
        this.messageList = result.list;
      } catch (err) {
        this.$message({
          type: "error",
          message: "获取所有留言失败",
        });
      }
    },
    // 审核switch状态改变
    async statusChange(val) {
      const { id, status } = val;
      try {
        // 更改留言状态
        let { message, result } = await this.$http.put(`/message/auditMessage/${id}/${status}`);
        if (result) {
          this.$message({
            type: "success",
            message: "修改成功！",
          });
        }
      } catch (err) {
        this.$message({
          type: "error",
          message: "修改状态失败",
        });
      }
    },
    // 删除留言按钮
    handleRowClick(val) {
      this.dialogDelete = true;
      this.deleteParams = val;
    },
    // 删除留言
    async deleteMessage() {
      const { id } = this.deleteParams;
      try {
        let { message, result } = await this.$http.delete(`/message/delete/${id}`);
        this.$message({
          type: "success",
          message: "删除留言成功！",
        });
        this.dialogDelete = false;
        this.getMessageAll();
      } catch (err) {
        console.log(err);
        this.$message({
          type: "error",
          message: "删除留言失败",
        });
      }
    },
    // 页数改变
    async handleSizeChange(page) {
      this.messageParams.size = page
      this.getMessageAll()
    },
    // 当前页改变
    async handleCurrentChange(current) {
      this.messageParams.current = current
      this.getMessageAll()
    }
  },
};
</script>

<style scoped>
.pagination {
  width: 100%;
  margin: 16px 0px;
  display: flex;
  justify-content: flex-end;
}
</style>
