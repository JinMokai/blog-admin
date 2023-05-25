<template>
    <div>
      <el-card class="box-card">
        <template #header>
          <div class="card-header">
            <span>编辑文章{{ $route.params.articleId }}</span>
          </div>
        </template>
        <el-form :model="addArticleParams" :inline="true" :rules="Rules">
          <el-form-item label="文章标题" style="width: 65%" prop="title">
            <el-input v-model="addArticleParams.title" placeholder="请输入文章标题" />
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
            <MdEditor v-model="addArticleParams.content" @onUploadImg="phtotoHardler" />
          </el-form-item>
        </el-form>
      </el-card>
      <!-- 对话框 -->
      <el-dialog v-model="dialogVisible" title="发布文章" style="width: 800px">
        <el-form :model="addArticleParams">
          <el-form-item label="文章标题" prop="title">
            <el-input v-model="addArticleParams.title" />
          </el-form-item>
          <el-form-item label="文章描述" prop="description">
            <el-input v-model="addArticleParams.description" />
          </el-form-item>
          <el-form-item label="文章分类" prop="categary">
            <el-select v-model="addArticleParams.categary" placeholder="请选择分类" size="large">
              <el-option v-for="(item, index) in categaryList" :key="index" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-switch
              v-model="addArticleParams.is_top"
              size="large"
              active-text="置顶"
              inactive-text="不置顶"
              :active-value="'0'"
              :inactive-value="'1'"
              @change="addArticleIsTop"
            />
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-radio-group v-model="addArticleParams.status" @change="articleStatus">
              <el-radio :label="1" size="large">公开</el-radio>
              <el-radio :label="2" size="large">私密</el-radio>
              <el-radio :label="0" size="large">草稿箱</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="文章类型" porp="type">
            <el-radio-group v-model="addArticleParams.type" @change="articleType">
              <el-radio :label="0" size="large">原创</el-radio>
              <el-radio :label="1" size="large">转载</el-radio>
            </el-radio-group>
          </el-form-item>
          <div style="display: flex; justify-content: flex-end">
            <el-form-item>
              <el-button plain size="small" @click="dialogVisible = false">取消</el-button>
              <el-button type="danger" plain size="small" @click="saveDraft">保存草稿</el-button>
              <el-button type="danger" size="small" @click="postArticle">发布文章</el-button>
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
    },
    data() {
      return {
        categaryList: [],
        addArticleParams: {
          title: "", // 文章标题 不能为空 必填
          description: "", // 文章描述 不能为空 必填
          content: "# hello world", // 文章内容 不能为空 必填
          category: "", // 分类名字
          is_top: 1, // 置顶文章 0-置顶 1-不置顶 默认:1
          type: 0, // 文章类型：0 原创 1 转载 默认:0
          status: 1, // 发布状态 0-草稿 1-发布 2- 私密 默认:1
        },
        // 编辑器文本内容
        dialogVisible: false, // 对话框
        Rules: {
          title: [{ required: true, message: "请输入文章标题", trigger: "blur" }],
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
        if (this.addArticleParams.title == "") {
          this.$message({
            type: "error",
            message: "请输入标题！",
          });
          return;
        }
        this.dialogVisible = true;
      },
      //  文章状态改变
      articleStatus(val) {
        console.log(val,'articleStatus')
      },
      // 文章类型改变
      articleType(val) {
        console.log(val, 'articleType')
      },
      // 保存草稿
      saveDraft() {
        console.log("saveDraft")
        this.dialogVisible = false
      },
      // 发布文章
      postArticle() {
        console.log('postArticle')
        this.dialogVisible = false
      }
    },
    components: {
      MdEditor,
    },
  };
  </script>
  
  <style lang="scss" scoped></style>
  