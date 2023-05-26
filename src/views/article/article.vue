<template>
  <div>
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>文章管理</span>
        </div>
      </template>
      <!-- 表单 -->
      <el-form :inline="true" :model="articleParams" class="user_box">
        <el-form-item label="文章标题" style="font-weight: 600">
          <el-input v-model="articleParams.title" placeholder="请输入文章标题" />
        </el-form-item>
        <el-form-item label="文章分类" style="font-weight: 600">
          <el-select v-model="articleParams.cat_id" placeholder="请选择文章分类" @change="categaryChange">
            <el-option v-for="(item, index) in categaryList" :key="index" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="是否置顶" style="font-weight: 600">
          <el-select v-model="articleParams.is_top" placeholder="请选择是否置顶" @change="topChange">
            <el-option label="置顶" value="0" />
            <el-option label="不置顶" value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="发布时间">
          <el-date-picker
            v-model="createdTime"
            type="daterange"
            range-separator="到"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            @change="dateChange"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSearch">
            搜索
            <el-icon class="el-icon--right">
              <Search />
            </el-icon>
          </el-button>
          <el-button type="primary" @click="onFresh" plain>
            重置
            <el-icon class="el-icon--right">
              <Refresh />
            </el-icon>
          </el-button>
        </el-form-item>
      </el-form>
      <el-button type="primary" size="small" @click="addArticle">
        <el-icon><CirclePlus /></el-icon>
        <span>新增</span>
      </el-button>
      <!-- tab -->
      <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleTabClick">
        <el-tab-pane label="所有文章" name="1">
          <ArticleTable
            :commList="articleList"
            @switch="switchStatus"
            @update="updateArticle"
            @delete="deleteArticle"
            @public="publicArticle"
          />
        </el-tab-pane>
        <el-tab-pane label="公开文章" name="2">
          <ArticleTable
            :commList="articlepublicList"
            @switch="switchStatus"
            @update="updateArticle"
            @delete="deleteArticle"
            @public="publicArticle"
          />
        </el-tab-pane>
        <el-tab-pane label="私密文章" name="3">
          <ArticleTable
            :commList="articlePrivate"
            @switch="switchStatus"
            @update="updateArticle"
            @delete="deleteArticle"
            @public="publicArticle"
          />
        </el-tab-pane>
        <el-tab-pane label="草稿箱" name="4">
          <ArticleTable
            :commList="articleDelete"
            @switch="switchStatus"
            @update="updateArticle"
            @delete="deleteArticle"
            @public="publicArticle"
          />
        </el-tab-pane>
      </el-tabs>
      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          v-model:current-page="articleParams.current"
          :page-sizes="[5, 10, 15, 20]"
          :page-size="articleParams.size"
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
import moment from "moment";
import ArticleTable from "@/components/articleTable.vue";
export default {
  created() {
    this.getAllCategary();
    this.getAllArticle();
  },
  data() {
    return {
      // 分类值
      categaryList: [],
      // 文章搜索参数
      articleParams: {
        current: 1, // 当前页
        size: 5, // 页数量
        title: "", // 标题
        status: "", // 发布状态 0-草稿 1-发布 2- 私密 默认:1
        is_top: "", // 置顶文章 0-置顶 1-不置顶 默认:1
        cat_id: null, // 分类id 默认0
      },
      total: 0,
      createdTime: [], // 创建时间
      // 所有文章
      articleList: [],
      // 公开文章
      articlepublicList: [],
      // 私密文章
      articlePrivate: [],
      // 草稿文章
      articleDelete: [],
      // tab标签默认首页
      activeName: "1",
      // 分页相关
      pagination: {
        small: true,
        background: true,
      },
    };
  },
  methods: {
    // 获取所有分类
    async getAllCategary() {
      try {
        let { result } = await this.$http.post("/categary/getCategaryAll");
        this.categaryList = result;
      } catch (err) {
        this.$message({
          type: "error",
          message: "获取分类数据错误！",
        });
      }
    },
    // 获取所有文章
    async getAllArticle() {
      try {
        this.articleParams.status = ''
        let { result } = await this.$http.post("/article/getArticleList", this.articleParams);
        this.articleList = result.list;
        this.total = result.total;
      } catch (err) {
        this.$message({
          type: "error",
          message: "获取文章数据错误！",
        });
      }
    },
    // 搜索
    async onSearch() {
      let params = {};
      this.createdTime.length != 0 &&
        Object.assign(params, {
          created: this.createdTime,
        });
      this.articleParams && Object.assign(params, this.articleParams);
      console.log(this.articleParams)
      try {
        let { message, result } = await this.$http.post("/article/getArticleList", params);

        const { list, current, size, total } = result;
        this.articleList = list;
        this.total = total;
        this.$message.success("搜索成功");
      } catch (err) {
        console.error(err);
        this.$message.error("搜索出错");
      }
    },
    // 重置
    onFresh() {
      this.articleParams = {
        current: 1,
        size: 5,
        title: "",
        status: "",
        is_top: "",
        cat_id: null,
      };
      this.createdTime = [];
    },
    // 分类选择
    categaryChange(value) {
      this.articleParams.categary = value
    },
    // 是否置顶
    topChange(value) {
      this.articleParams.is_top = value;
    },
    // 日期改变
    dateChange(arr) {
      if (arr == null) return;
      this.createdTime = arr.map((item) => {
        return moment(item).format("YYYY-MM-DD HH:mm:ss");
      });
      console.log(this.createdTime);
    },
    // 置顶修改
    async switchStatus(topVal) {
      // id表示用户 is_top 表示置顶参数 置顶文章 0-置顶 1-不置顶 默认:1
      const { id, is_top } = topVal;
      try {
        await this.$http.put(`/article/updateTop/${id}/${is_top}`);
      } catch (err) {
        console.log(err);
        this.$message.error("修改置顶失败!");
      }
    },
    // 修改
    updateArticle(val) {
      // 将id传给修改组件
      const { id: articleId } = val;
      this.$router.push(`/home/editArticle/${articleId}`);
      console.log(val, "updateArticle");
    },
    // 公开/隐藏
    async publicArticle(scope) {
      // 一个是文章id一个是修改后的文章状态码状态码 $index表示数组索引 从0开始(index未使用)
      const { $index: index, row } = scope;
      let { id, status } = row;
      row.status = status === "1" ? "2" : "1";
      // @bug '' "" 这是前期建表的问题  id为什么类型好像都可以? (sequlize orm框架的保底方案)
      try {
        const res = await this.$http.put(`/article/updateStatus/${id}/${row.status}`);
        this.$message.success(`${status == "1" ? "公开成功" : "隐藏成功"}`);
      } catch (err) {
        const { message } = err.response.data;
        this.$message.error(message);
      }
    },
    // 删除(回收站删除) status 只要不为0就是回收站删除 待会写?
    async deleteArticle(val) {
      const { id, status } = val;
      console.log(val);
      try {
        await this.$http.delete(`/article/delete/${id}/${status}`);
        // 删除表单数据
        this.articleDelete = this.articleDelete.filter((item) => item.id !== id);
      } catch (err) {
        const { message } = err.response.data;
        this.$message.error(message);
      }
    },
    // 标签切换
    handleTabClick(value) {
      const { name } = value.props;
      try {
        if (name === '1') {
          console.log(this.articleParams)
          this.getAllArticle()
        }
        if (name === "2") {
          console.log(this.articleParams);
          this.getArticlePublicList();
        }
        if (name === "3") {
          console.log(this.articleParams);
          this.getArticlePrivateList();
        }
        if (name === "4") {
          console.log(this.articleParams);
          this.getArticleDelete();
        }
      } catch (err) {
        this.$message.error("错误!");
      }
    },
    // 获取所有公开文章
    async getArticlePublicList() {
      let params = this.articleParams;
      params.status = "1";
      params.current = 1;
      this.createdTime.length != 0 &&
        Object.assign(params, {
          created: this.createdTime,
        });
      let { message, result } = await this.$http.post("/article/getArticleList", params);
      let { list, ...res } = result;
      this.articleParams.current = res.current;
      this.total = res.total;
      this.articleParams.size = res.size;
      this.articlepublicList = list;
    },
    //  获取所有私密文章
    async getArticlePrivateList() {
      let params = this.articleParams;
      params.status = "2";
      params.current = 1;
      this.createdTime.length != 0 &&
        Object.assign(params, {
          created: this.createdTime,
        });
      let { message, result } = await this.$http.post("/article/getArticleList", params);
      let { list, ...res } = result;
      this.articleParams.current = res.current;
      this.total = res.total;
      this.articleParams.size = res.size;
      this.articlePrivate = list;
    },
    //  获取所有草稿文章
    async getArticleDelete() {
      let params = this.articleParams;
      params.status = "0";
      params.current = 1;

      this.createdTime.length != 0 &&
        Object.assign(params, {
          created: this.createdTime,
        });
      let { message, result } = await this.$http.post("/article/getArticleList", params);
      let { list, ...res } = result;
      this.articleParams.current = res.current;
      this.total = res.total;
      this.articleParams.size = res.size;
      this.articleDelete = list;
    },
    // 新增文章
    addArticle() {
      this.$router.push("/home/addarticle");
    },
    // 分页操作
    handleSizeChange(val) {
      console.log(val, "handleSizeChange");
      this.articleParams.size = val;
      this.commonPage();
    },
    // 分页操作 处理当前页
    handleCurrentChange(val) {
      console.log(val, "handleCurrentChange");
      this.articleParams.current = val;
      this.commonPage();
    },
    // 公共搜索
    async commonPage() {
      try {
        let params = {};
        this.createdTime != 0 &&
          Object.assign(params, {
            created: this.createdTime,
          });
        this.articleParams && Object.assign(params, this.articleParams);
        let { message, result } = await this.$http.post("/article/getArticleList", params);
        const { list, current, size, total } = result;
        this.articleList = list;
        this.total = total;
      } catch (err) {
        console.log(err);
        this.$message.error("查询失败!");
      }
    },
  },
  computed: {},
  components: {
    ArticleTable,
  },
  watch: {
    // 事件侦听器
    createdTime(newValue, oldValue) {
      if (newValue == null) {
        this.createdTime = []
      }
    }
  }
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
