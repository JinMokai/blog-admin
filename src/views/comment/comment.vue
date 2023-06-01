<template>
  <div>
    <el-card>
      <template #header>
        <div class="card-header">
          <span>评论管理</span>
        </div>
      </template>
      <el-form :inline="true">
        <el-form-item label="选择文章">
          <el-select v-model="selectValue" placeholder="请选择你的文章" size="large" @change="selectChange" prop="selectValue">
            <el-option v-for="item in commentTitle" :key="item.id" :label="item.title" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSearch">
            <el-icon><Search /></el-icon>
            <span>搜索</span>
          </el-button>
          <el-button type="primary" @click="onFresh" plain>
            重置
            <el-icon class="el-icon--right">
              <Refresh />
            </el-icon>
          </el-button>
          <el-button type="danger" size="small" @click="muchDelete">
            <el-icon><Delete /></el-icon>
            <span>批量删除</span>
          </el-button>
        </el-form-item>
      </el-form>
      <div v-if="!commentList.length">暂无数据</div>
      <el-table
        v-else
        :data="commentList"
        style="width: 100%"
        v-loading="loading"
        max-height="352px"
        border
        @select="selectTableRow"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column prop="username" label="评论用户名" width="100"></el-table-column>
        <el-table-column prop="content" label="评论内容" width="400" show-overflow-tooltip></el-table-column>
        <el-table-column prop="created" label="评论时间" width="200" show-overflow-tooltip></el-table-column>
        <el-table-column fixed="right" label="操作" width="100">
          <template #default="scope">
            <el-popconfirm title="确定删除?" @confirm="deleteData(scope.row)">
              <template #reference>
                <el-button :icon="Delete" link type="danger" size="small" @click="">
                  <el-icon>
                    <Delete />
                  </el-icon>
                  删除</el-button
                >
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <!-- 删除对话框 -->
      <el-dialog v-model="dialogVisible" title="提示" width="30%" :before-close="handleClose">
        <span>确定删除?</span>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="dialogDelete"> 确定 </el-button>
          </span>
        </template>
      </el-dialog>
      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          v-model:current-page="commentParams.current"
          :page-sizes="[5, 10, 15, 20]"
          :page-size="commentParams.size"
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
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 评论列表
      commentList: [],
      // 有评论的文章列表
      commentTitle: [],
      // 默认搜索参数
      commentParams: {
        current: 1,
        size: 10,
      },
      // 文章id
      article_id: 0,
      // 删除选择id
      deleteIds: [],
      loading: true,
      // 总共多少数据
      total: 0,
      // 分页相关参数
      pagination: {
        small: true,
        size: true,
        background: true,
      },
      // 选择器选中的值
      selectValue: "",
      // 删除对话框
      dialogVisible: false,
    };
  },
  methods: {
    // 搜索
    async onSearch() {
      this.getCommentList();
      this.$message.success("搜索成功!");
    },
    // 获取有评论的文章列表
    async getExitCommentArticle() {
      try {
        let { message, result } = await this.$http.get("/comment/getCommentArticle");
        this.commentTitle = result;
        this.loading = false;
      } catch (err) {
        this.$message.error("数据加载失败！");
        console.log(err);
      }
    },
    // 获取评论列表
    async getCommentList() {
      try {
        this.article_id != 0 && Object.assign(this.commentParams, { article_id: this.article_id });
        let { result } = await this.$http.post("/comment/backGetCommentList", this.commentParams);
        this.commentList = result.list;
        this.total = result.total;
      } catch (err) {
        this.$message.error("数据加载失败!");
        console.log(err);
      }
    },
    // 选择框改变
    selectChange(article_id) {
      this.article_id = article_id;
    },
    // 单个删除
    async deleteData(val) {
      const { id } = val;
      const idList = [];
      idList.push(id);
      try {
        let { message, result } = await this.$http.post("/comment/backdelete", {
          idList,
        });
        this.$message.success(message);
        this.total = this.total - result;
        this.commentList = this.commentList.filter((item) => item.id !== id);
      } catch (err) {
        const { message } = res.response.data;
        this.$message.error(message);
      }
    },
    // 批量删除显示对话框
    muchDelete() {
      this.dialogVisible = true;
    },
    // 真实删除数据
    async dialogDelete() {
      let idList = this.deleteIds.map((item) => item);
      try {
        let { message, result } = await this.$http.post("/comment/backdelete", {
          idList: this.deleteIds,
        });
        this.total = this.total - result;
        this.commentList = this.commentList.filter((item) => !idList.includes(item.id));
        this.$message.success(`${message},删除了${result}数据`);
        this.dialogVisible = false;
      } catch (err) {}
    },
    // size改变
    handleSizeChange(val) {
      this.commentParams.size = val;
      this.getCommentList();
    },
    // current改变
    handleCurrentChange(val) {
      this.commentParams.current = val;
      this.getCommentList();
    },
    // 重置
    onFresh() {
      this.commentParams = {
        current: 1,
        size: 10,
      };
      this.selectValue = "";
      this.article_id = 0;
    },
    // 表格选中
    selectTableRow(val) {
      let res = val.map((item) => item.id);
      this.deleteIds = res;
    },
  },
  created() {
    this.getExitCommentArticle();
    this.getCommentList();
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
