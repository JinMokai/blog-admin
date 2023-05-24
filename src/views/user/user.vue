<template>
  <div>
    <Header message="用户管理"/>
    <el-form :inline="true" :model="userInfo" class="user_box">
      <el-form-item label="用户名" style="font-weight: 600">
        <el-input v-model="userInfo.username" placeholder="请输入用户名" />
      </el-form-item>
      <el-form-item label="用户角色" style="font-weight: 600">
        <el-select v-model="userInfo.region" placeholder="请输入用户角色">
          <el-option label="管理员" value="1" />
          <el-option label="普通用户" value="2" />
        </el-select>
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
    <el-table :data="userList" style="width: 100%" v-loading="loading" height="352px">
      <el-table-column type="selection" width="55" />
      <el-table-column type="index" label="序号" width="50" />
      <el-table-column prop="username" label="用户名" width="120" align="center" />
      <el-table-column prop="avatar" label="头像" width="120">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <el-avatar :src="scope.row.avatar" />
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="role" label="角色" width="220" align="center">
        <template #default="scope">
          <el-switch
            v-model="scope.row.role"
            :active-value="'1'"
            :inactive-value="'2'"
            size="large"
            active-text="管理员"
            inactive-text="普通用户"
            @change="switchChange(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column prop="status" label="是否禁用" width="220" align="center">
        <template #default="scope">
          <el-switch
            v-model="scope.row.status"
            :active-value="'1'"
            :inactive-value="'0'"
            size="large"
            active-text="不禁用"
            inactive-text="禁用"
            @change="statusChange(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column prop="created" label="创建时间" width="300" align="center" />
      <el-table-column fixed="right" label="操作" width="120">
        <template #default="scope">
          <el-button :icon="Edit" link type="primary" size="small" @click="handleClick(scope.row)">
            <el-icon>
              <EditPen />
            </el-icon>
            修改</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 对话框 -->
    <el-dialog v-model="dialogVisible" title="编辑用户" width="30%" draggable @close="modalCloseHardler">
      <el-form
        width="50%"
        ref="ruleFormRef"
        :model="updateUser"
        :rules="rules"
        label-width="70px"
        class="ruleForm"
        :size="formSize"
        status-icon
      >
        <el-form-item label="昵称" prop="username">
          <el-input v-model="updateUser.username" />
        </el-form-item>
        <div style="padding-block: 0.5em; padding-left: 1em">头像</div>
        <el-image
          style="width: 100px; height: 100px; border-radius: 50%"
          :src="avatarUrl"
          :zoom-rate="1.2"
          :initial-index="4"
          fit="cover"
        />
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="dialogDataHardler"> 确定 </el-button>
        </span>
      </template>
    </el-dialog>
    <div class="pagination">
      <el-pagination
        v-model:current-page="current"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="size"
        :small="small"
        :disabled="disabled"
        :background="Tablebackground"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import Header from "@/components/header.vue"
export default {
  data() {
    return {
      userList: [],
      userInfo: {
        username: "",
        region: "",
      },
      current: 1, // 默认当前页
      size: 5, // 默认每页五个数据
      loading: true,
      small: true, // 表格大小
      total: 0, // 数据总量
      Tablebackground: true, // 分页背景
      dialogVisible: false, // 修改对话框
      avatarUrl: "", // 头像地址
      updateUser: {}, // 模块框
      // 验证表达
      rules: {
        name: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 245, message: "长度区间3-245", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    // 获取用户数据
    async getUserList() {
      this.$http
        .post("/user/getUserList", {
          current: this.current,
          size: this.size,
          username: this.userInfo.username,
          role: this.userInfo.region,
        })
        .then((res) => {
          console.log(res);
          this.total = res.result.total;
          this.current = res.result.current;
          this.size = res.result.size;
          if (res.code == 0) {
            this.userList = res.result.list;
            this.loading = false;
          }
        })
        .catch((error) => {
          this.$message({
            message: "获取用户信息失败",
            type: "error",
          });
          console.error("获取用户信息失败", error);
        });
    },
    // 搜索
    async onSearch() {
      try {
        this.loading = true;
        let { message, result } = await this.$http.post("/user/getUserList", {
          current: this.current,
          size: this.size,
          username: this.userInfo.username,
          role: this.userInfo.region,
        });
        (this.current = result.current), (this.userList = result.list), (this.size = result.size), (this.total = result.total);
        this.$message({
          type: "success",
          message: "搜索成功",
        });
        this.loading = false;
      } catch (err) {
        console.log(err);
        this.$message({
          type: "error",
          message: "搜索失败",
        });
        this.loading = false;
      }
    },
    // 重置
    onFresh() {
      this.userInfo.username = "";
      this.userInfo.region = "";
    },
    // 开关切换 通过插槽获取id和权限
    async switchChange({ id, role }) {
      try {
        let res = await this.$http.put(`/user/updateRole/${id}/${role}`);
        if (res.code == 0) {
          this.$message({
            message: res.message,
            type: "success",
          });
        } else {
          this.$message({
            message: "修改失败",
            type: "error",
          });
        }
      } catch (err) {
        console.error("修改失败");
        this.$message({
          message: "修改失败",
          type: "error",
        });
      }
    },
    // 开关切换 切换是否禁用用户
    async statusChange({ id, status }) {
      try {
        // 禁用
        if (status == 0) {
          let res = await this.$http.post(`/user/disableUser/${id}`);
          this.$message({
            message: res.message,
            type: "success",
          });
        }
        if (status == 1) {
          let res = await this.$http.post(`/user/activeUser/${id}`);
          this.$message({
            message: res.message,
            type: "success",
          });
        }
      } catch (err) {
        this.$message({
          message: "禁用用户失败",
          type: "error",
        });
      }
    },
    // page-size切换
    async handleSizeChange(pagesize) {
      this.loading = true;
      try {
        let { message, result } = await this.$http.post("/user/getUserList", {
          current: this.current,
          size: pagesize,
          username: this.userInfo.username,
        });
        (this.current = result.current), (this.userList = result.list), (this.size = result.size), (this.total = result.total);
        this.loading = false;
      } catch (err) {
        this.$message({
          type: "error",
          message: "切换失败",
        });
        this.loading = false;
      }
    },
    // 当前页切换
    async handleCurrentChange(value) {
      this.loading = true;
      try {
        let { message, result } = await this.$http.post("/user/getUserList", {
          current: value,
          size: this.size,
          username: this.userInfo.username,
        });
        (this.current = result.current), (this.userList = result.list), (this.size = result.size), (this.total = result.total);
        this.loading = false;
      } catch (err) {
        this.$message({
          type: "error",
          message: "切换失败",
        });
        this.loading = false;
      }
    },
    // 弹出对话框
    handleClick(value) {
      const { avatar, ...result } = value;
      this.updateUser = result;
      this.avatarUrl = avatar;
      this.dialogVisible = true;
    },
    // 模块框点击
    async dialogDataHardler() {
      this.dialogVisible = false;
      try {
        const data = this.updateUser;
        await this.$http.put("/user/adminUpdateUserInfo", { username: data.username, id: data.id });
        this.$message({
          type: "success",
          message: "修改用户名成功",
        });
        // 修改就全部重新查询
        this.getUserList();
      } catch (err) {
        console.log(err);
        this.$message({
          type: "error",
          message: "修改用户名失败",
        });
      }
    },
    // 模块关闭处理函数
    modalCloseHardler() {
      console.log("hello");
    },
  },
  computed: {},
  components: {
    Header
  }
};
</script>

<style scoped>
.user_box {
  padding: 24px;
}

.pagination {
  width: 100%;
  margin: 16px 0px;
  display: flex;
  justify-content: flex-end;
}
</style>
