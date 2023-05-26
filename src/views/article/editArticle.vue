<template>
  <div>
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>修改文章</span>
        </div>
      </template>
      <el-form :model="updateArticleParams" :inline="true" :rules="Rules">
        <el-form-item label="文章标题" style="width: 65%" prop="title">
          <el-input v-model="updateArticleParams.title" placeholder="请输入文章标题" />
        </el-form-item>
        <el-form-item style="width: 25%">
          <div>
            <el-button type="danger" size="small" @click="publishArticle">
              <el-icon><Document /></el-icon>
              <span>发布文章</span>
            </el-button>
          </div>
        </el-form-item>
        <el-form-item style="width: 100%">
          <MdEditor v-model="updateArticleParams.content" @onUploadImg="phtotoHardler" />
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 对话框 -->
    <el-dialog v-model="dialogVisible" title="发布文章" style="width: 800px">
      <el-form :model="updateArticleParams" :rules="dialogRules" ref="diaLogRuleFormRef">
        <el-form-item label="文章标题" prop="title">
          <el-input v-model="updateArticleParams.title" />
        </el-form-item>
        <el-form-item label="文章描述" prop="description">
          <el-input
            v-model="updateArticleParams.description"
            maxlength="255"
            placeholder="请输入文章描述"
            show-word-limit
            type="textarea"
          />
        </el-form-item>
        <el-form-item label="文章分类" prop="category">
          <el-select
            v-model="updateArticleParams.category"
            placeholder="请选择分类"
            default-first-option
            filterable
            allow-create
            size="large"
            @change="articleCategary"
          >
            <el-option v-for="(item, index) in categaryList" :key="index" :label="item.name" :value="item.name" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-switch
            v-model="updateArticleParams.is_top"
            size="large"
            active-text="置顶"
            inactive-text="不置顶"
            :active-value="'0'"
            :inactive-value="'1'"
            @change="addArticleIsTop"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="updateArticleParams.status" @change="articleStatus">
            <el-radio :label="'1'" size="large">公开</el-radio>
            <el-radio :label="'2'" size="large">私密</el-radio>
            <el-radio :label="'0'" size="large">草稿箱</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="文章类型" prop="type">
          <el-radio-group v-model="updateArticleParams.type" @change="articleType">
            <el-radio :label="'0'" size="large">原创</el-radio>
            <el-radio :label="'1'" size="large">转载</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="原文链接" prop="origin_url" v-if="updateArticleParams.type == '1'">
          <el-input
            v-model="updateArticleParams.origin_url"
            maxlength="2000"
            placeholder="请输入网址"
            show-word-limit
            type="textarea"
          />
        </el-form-item>
        <div style="display: flex; justify-content: flex-end">
          <el-form-item>
            <el-button plain size="small" @click="cancel">取消</el-button>
            <el-button type="danger" plain size="small" @click="saveDraft">保存草稿</el-button>
            <el-button type="danger" size="small" @click="postArticle()">发布文章</el-button>
          </el-form-item>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { MdEditor } from "md-editor-v3";
import "md-editor-v3/lib/style.css";
export default {
  created() {
    this.getAllCategary();
    this.getUpdateUserById();
  },
  data() {
    return {
      categaryList: [],
      updateArticleParams: {
        title: "", // 文章标题 不能为空 必填
        description: "", // 文章描述 不能为空 必填
        content: "", // 文章内容 不能为空 必填
        category: "", // 分类名字
        is_top: 1, // 置顶文章 0-置顶 1-不置顶 默认:1
        type: 0, // 文章类型：0 原创 1 转载 默认:0
        status: 1, // 发布状态 0-草稿 1-发布 2- 私密 默认:1
        origin_url: "", // 转载链接
        user_id: "", // 用户
      },
      // 编辑器文本内容
      dialogVisible: false, // 对话框
      Rules: {
        title: [{ required: true, message: "请输入文章标题", trigger: "blur" }],
      },
      // 对话框表单验证
      dialogRules: {
        title: [{ required: true, message: "请输入文章标题", trigger: "blur" }],
        description: [
          { required: true, message: "请输入文章描述", trigger: "blur" },
          { max: 255, message: "不应该超过255个字符", trigger: "blur" },
        ],
        category: [{ required: true, message: "请选择文章分类", trigger: "blur" }],
        origin_url: [
          { required: true, message: "请输入网址", trigger: "blur" },
          { max: 2000, message: "不应该超过2000个字符", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    // 获取当前id修改用户信息
    async getUpdateUserById() {
      try {
        let { result } = await this.$http.get(`/article/BackgetArticleById/${this.$route.params.articleId}`);
        Object.assign(this.updateArticleParams, result);
      } catch (err) {
        console.log(err);
        this.$message.error("获取数据失败");
      }
    },
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
    // 编辑器图片处理器
    async phtotoHardler(files, callback) {
      const res = await Promise.all(
        files.map((file) => {
          return new Promise((rev, rej) => {
            const form = new FormData();
            form.append("file", file);

            this.$http
              .post("/upload/upload", form, {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              })
              .then((res) => rev(res))
              .catch((error) => rej(error));
          });
        })
      );
      callback(res.map((item) => item.imgurl));
    },
    // 发布文章按钮
    publishArticle() {
      if (this.updateArticleParams.title == "") {
        this.$message({
          type: "error",
          message: "请输入标题！",
        });
        return;
      }
      this.dialogVisible = true;
    },
    // 保存草稿
    async saveDraft() {
      // 校验表单是否合法
      this.$refs.diaLogRuleFormRef.validate(async (valid) => {
        if (!valid) {
          this.$message.warning("请按提示信息填写内容！");
          return;
        } else {
          try {
            this.updateArticleParams.status = 0;
            await this.$http.put("/article/update", {
              article: this.updateArticleParams,
            });
            this.$message.success("修改文章成功");
            this.dialogVisible = false;
          } catch (err) {
            const { message } = err.response.data;
            this.$message.error(message);
          }
        }
      });
    },
    // 发布文章
    async postArticle() {
      // 校验表单是否合法
      this.$refs.diaLogRuleFormRef.validate(async (valid) => {
        if (!valid) {
          this.$message.warning("请按提示信息填写内容！");
          return;
        } else {
          try {
            const res = await this.$http.put("/article/update", {
              article: this.updateArticleParams,
            });
            this.$message.success("修改文章成功");
            this.dialogVisible = false;
            // this.commonRest(); // 提交之后数据重置 防止污染
          } catch (err) {
            const { message } = err.response.data;
            this.$message.error(message);
          }
        }
      });
    },
    // 取消按钮
    cancel() {
      this.dialogVisible = false;
      // this.commonRest();
    },
    // 公共重置
    commonRest() {
      this.updateArticleParams = {
        title: "", // 文章标题 不能为空 必填
        description: "", // 文章描述 不能为空 必填
        content: "", // 文章内容 不能为空 必填
        category: "", // 分类名字
        is_top: 1, // 置顶文章 0-置顶 1-不置顶 默认:1
        type: 0, // 文章类型：0 原创 1 转载 默认:0
        status: 1, // 发布状态 0-草稿 1-发布 2- 私密 默认:1
      };
    },
  },
  components: {
    MdEditor,
  },
};
</script>

<style lang="scss" scoped></style>
