<template>
  <div class="box">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span style="line-height: 32px">个人信息管理</span>
          <el-button type="primary" plain @click="editUserInfo" v-if="!isEdit">编辑</el-button>
          <div v-else>
            <el-button type="info" plain @click="editCancel">取消</el-button>
            <el-button type="danger" plain @click="editSave">保存</el-button>
          </div>
        </div>
      </template>
      <el-form
        width="50%"
        ref="ruleFormRef1"
        :model="userInfo"
        :rules="rules"
        label-width="70px"
        class="ruleForm"
        :size="formSize"
        status-icon
      >
        <!-- 展示 -->
        <template v-if="isEdit">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="userInfo.username" />
          </el-form-item>
          <div style="padding-block: 0.5em; padding-left: 1em">头像</div>
          <el-image
            style="width: 100px; height: 100px; border-radius: 50%"
            :src="avatarUrl"
            :zoom-rate="1.2"
            :initial-index="4"
            fit="cover"
          />
        </template>
        <template v-else>
          <el-form-item label="用户名" prop="username">
            <div>{{ userInfo.username }}</div>
          </el-form-item>
          <div style="padding-block: 0.5em; padding-left: 1em">头像</div>
          <el-image
            style="width: 100px; height: 100px; border-radius: 50%"
            :src="avatarUrl"
            :zoom-rate="1.2"
            :initial-index="4"
            fit="cover"
          />
        </template>
        <!-- end -->
      </el-form>
    </el-card>
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span style="line-height: 32px">密码管理</span>
          <div>
            <el-button type="danger" plain @click="passwordSave">保存</el-button>
          </div>
        </div>
      </template>
      <!-- 密码表单 -->
      <el-form ref="ruleFormRef2" :model="userPassword" :rules="rules" label-width="120px" :size="formSize" status-icon v-loading="loading">
        <el-form-item label="原密码" prop="oldPassword">
          <el-input v-model="userPassword.oldPassword" type="password" autocomplete="off" />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="userPassword.newPassword" type="password" autocomplete="off" />
        </el-form-item>
        <el-form-item label="二次确认密码" prop="enterPassword">
          <el-input v-model="userPassword.enterPassword" type="password" autocomplete="off" />
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      userInfo: {},
      avatarUrl: "",
      rules: {
        name: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 245, message: "长度区间3-245", trigger: "blur" },
        ],
        oldPassword: [{ required: true, message: "请输入原密码", trigger: "blur" }],
        newPassword: [{ required: true, message: "请输入新密码", trigger: "blur" }],
        enterPassword: [{ required: true, message: "请输入二次密码", trigger: "blur" }],
      },
      isEdit: false, // 显示编辑
      userPassword: {
        oldPassword: "",
        newPassword: "",
        enterPassword: "",
      }, // 多重密码判断
    };
  },
  created() {
    this.getLocalUser();
  },
  methods: {
    // 获取本地用户数据
    async getLocalUser() {
      let { id } = JSON.parse(localStorage.getItem("user"));
      let { result } = await this.$http.get(`user/getUserInfoById/${id}`);
      this.userInfo = result;
      this.avatarUrl = result.avatar;
      this.$store.commit("auth/setUser", JSON.stringify(result));
    },
    // 编辑显示隐藏
    editUserInfo() {
      this.isEdit = !this.isEdit;
    },
    // 取消返回
    async editCancel() {
      this.isEdit = false;
      // 如取消 后端返回
      this.getLocalUser();
    },
    // edit保存信息
    async editSave() {
      try {
        let res = await this.$http.put("/user/updateUserInfo", {
          username: this.userInfo.username,
        });
        // 重新获取数据
        this.getLocalUser();
        // 关闭编辑
        this.isEdit = false;
        this.$message({
          type: "success",
          message: res.message,
        });
      } catch (err) {
        const { message, code } = err.response.data;
        this.$message({
          type: "error",
          message,
        });
      }
    },
    // 密码保存
    async passwordSave() {
      this.loading = true;
      try {
        let { code, message } = await this.$http.put("/user/updatePassword", {
          password: this.userPassword.oldPassword,
          password1: this.userPassword.newPassword,
          password2: this.userPassword.enterPassword,
        });
        this.$message({
          type: "success",
          message,
        });
        this.loading = false;
      } catch (err) {
        const { message, code } = err.response.data;
        this.$message({
          type: "error",
          message,
        });
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.box {
  display: flex;
  flex-direction: row;
  gap: 1rem;
}
.box-card {
  width: 50%;
}
.card-header {
  display: flex;
  gap: 1rem;
  justify-content: space-around;
}
</style>
