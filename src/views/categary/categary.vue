<template>
  <div>
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>分类管理</span>
        </div>
      </template>
      <el-form :inline="true" :model="categoryList" class="">
        <el-form-item label="分类名称">
          <el-input v-model="searchParams.name" placeholder="请输入分类名称" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSearch">
            <el-icon><Search /></el-icon>
            <span>搜索</span>
          </el-button>
          <el-button @click="onFresh">
            <el-icon><Refresh /></el-icon>
            <span>重置</span>
          </el-button>
        </el-form-item>
        <el-form-item style="width: 100%; display: flex; justify-content: space-between">
          <el-button type="danger" size="small" @click="muchDelete">
            <el-icon><Delete /></el-icon>
            <span>批量删除</span>
          </el-button>
          <el-button type="primary" size="small" @click="Add">
            <el-icon><CirclePlus /></el-icon>
            <span>新增</span>
          </el-button>
        </el-form-item>
      </el-form>
      <!-- table -->
      <el-table :data="categoryList" height="352px" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column type="index" label="序号" width="100" />
        <el-table-column prop="name" label="分类名" width="200" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="created" label="创建事件" width="300" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column fixed="right" label="操作" width="120" align="center">
          <template #default="scope">
            <el-button :icon="Edit" link type="primary" size="small" @click="updateCategory(scope.row)">
              <el-icon>
                <EditPen />
              </el-icon>
              修改</el-button
            >
            <el-popconfirm title="确定删除?" @confirm="deleteCatrgory(scope.row)">
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
      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          v-model:current-page="searchParams.current"
          :page-sizes="[5, 10, 15, 20]"
          :page-size="searchParams.size"
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
    <el-dialog v-model="dialogVisible" title="新增分类" width="30%">
      <el-form :model="formData" :rules="formRules" ref="diaForm">
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="formData.name" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span>
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="dialogEnter"> 确定 </el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 修改对话框 -->
    <el-dialog v-model="dialogVisibleUpdate" title="修改分类" width="30%">
      <el-form :model="updateFormData" :rules="formRulesUpdate" ref="updateRef">
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="updateFormData.name" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span>
          <el-button @click="dialogVisibleUpdate = false">取消</el-button>
          <el-button type="primary" @click="updateEnter"> 确定 </el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 删除对话框 start -->
    <el-dialog v-model="dialogDelete" width="40%" title="提示" top="25vh">
      <span>是否删除？</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogDelete = false">取消</el-button>
          <el-button type="primary" @click="deleteTrue"> 确定 </el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 删除对话框 end -->
  </div>
</template>

<script>
export default {
  created() {
    this.getCategoryAll();
  },
  data() {
    return {
      categoryList: [],
      dialogVisible: false,
      dialogVisibleUpdate: false, // 修改对话框
      dialogDelete: false, // 删除对话框
      // 搜索参数
      searchParams: {
        current: 1,
        size: 10,
        name: "",
      },
      // 分页相关
      pagination: {
        small: true,
        background: true,
      },
      total: 0, // 总数
      // 表单数据
      formData: {
        name: "",
      },
      //   修改表单数据
      updateFormData: {
        name: "",
        id: 0,
      },
      //   验证表单
      formRules: {
        name: [{ required: true, message: "请输入分类名称", trigger: "blur" }],
      },
      formRulesUpdate: {
        name: [{ required: true, message: "请输入分类名称", trigger: "blur" }],
      },
      // 多选
      idList: [],
    };
  },
  methods: {
    // 获取所有分类
    async getCategoryAll() {
      let { result: res } = await this.$http.post("/categary/getCategoryList", this.searchParams);
      this.total = res.total;
      this.categoryList = res.list;
    },
    // 新增按钮(显示弹窗)
    Add() {
      this.dialogVisible = true;
    },
    // 确定表单提交
    async dialogEnter() {
      this.$refs.diaForm.validate(async (valid) => {
        if (!valid) {
          this.$message.warning("请按提示信息填写内容！");
          return;
        } else {
          try {
            let { message, result } = await this.$http.post("/categary/add", {
              name: this.formData.name,
            });
            this.total += 1;
            this.categoryList.push(result);
            this.$message.success("添加分类成功");
            this.dialogVisible = false;
          } catch (err) {
            const { message } = err.response.data;
            this.$message.error(message);
          }
        }
      });
    },
    // 修改表单提交
    updateEnter() {
      this.$refs.updateRef.validate(async (valid) => {
        if (!valid) {
          this.$message.warning("请按提示信息填写内容！");
          return;
        } else {
          try {
            let res = await this.$http.put("/categary/update", this.updateFormData);
            const index = this.categoryList.findIndex((item) => item.id === this.updateFormData.id);
            console.log(index);
            if (index !== -1) {
              // 将更新数据替换原数组
              Object.assign(this.categoryList[index], this.updateFormData);
            }
            this.dialogVisibleUpdate = false;
          } catch (err) {
            console.log("修改失败");
            this.$message.error("修改失败");
          }
        }
      });
    },
    // 重置
    onFresh() {
      this.searchParams = {
        current: 1,
        size: 5,
      };
    },
    // 修改分类
    updateCategory(row) {
      const { name, id } = row;
      this.updateFormData.name = name;
      this.updateFormData.id = id;
      this.dialogVisibleUpdate = true;
    },
    // 删除分类
    async deleteCatrgory(row) {
      try {
        const { id } = row;
        let { result, message } = await this.$http.post("/categary/delete", {
          idList: [id],
        });
        // 不等于id 也就等于删除了
        this.categoryList = this.categoryList.filter((item) => item.id !== id);
        this.total = this.total - result.deleteCount;
        this.dialogDelete = false;
        this.$message.success(message);
      } catch (err) {
        console.log(err);
        this.$message.error("删除分类失败");
      }
    },
    // size改变
    handleSizeChange(size) {
      this.searchParams.size = size;
      this.common();
    },
    // current 改变
    handleCurrentChange(current) {
      this.searchParams.current = current;
      this.common();
    },
    // 公共分页搜索
    async common() {
      try {
        let { result } = await this.$http.post("/categary/getCategoryList", this.searchParams);
        this.total = result.total;
        this.categoryList = result.list;
      } catch (err) {
        console.log(err);
        this.$message.error("数据加载失败");
      }
    },
    // table选择改变
    handleSelectionChange(val) {
      console.log(val);
      this.idList = val;
    },
    // 搜索
    async onSearch() {
      let { result } = await this.$http.post("/categary/getCategoryList", this.searchParams);
      this.total = result.total;
      this.categoryList = result.list;
      this.message.success("搜索成功");
    },
    // 批量删除按钮(弹出弹框)
    muchDelete() {
      if (this.idList.length === 0) {
        this.$message({
          type: "warning",
          message: "请选中数据!",
        });
        return;
      }
      this.dialogDelete = true;
    },
    // 批量删除
    async deleteTrue() {
      try {
        let params = this.idList.map((item) => item.id);
        let { result, message } = await this.$http.post("/categary/delete", {
          idList: params,
        });
        this.categoryList = this.categoryList.filter((item) => !params.includes(item.id));
        this.total = this.total - result.deleteCount;
        this.dialogDelete = false;
        this.$message.success(message);
      } catch (err) {
        console.log(err);
        this.$message.error("删除分类失败");
      }
    },
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
