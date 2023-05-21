<template>
    <div class="container">
        <div id="title">
            <h1>博客后台管理系统</h1>
        </div>
        <div class="input">
            <el-input v-model="username" prefix-icon="el-icon-user" placeholder="请输入用户名"></el-input>
        </div>
        <div class="input">
            <el-input v-model="password" prefix-icon="el-icon-lock" placeholder="请输入密码" show-password></el-input>
        </div>
        <div class="input">
            <el-button @click="login" style="width: 500px;" type="primary" :disabled="disabled">登录</el-button>
        </div>
    </div>
</template>

<script>
import Storage from "@/store/Stroage"
import { ElMessage } from "element-plus"
export default {
    name: "Login",
    data() {
        return {
            username: "",
            password: ""
        }
    },
    computed: {
        // 如果用户名和密码为空就禁用登录
        disabled() {
            return this.username.length == 0 || this.password.length == 0
        }
    },
    methods: {
        // 登录逻辑
        async login() {
            const loginParams = {
                username: this.username,
                password: this.password
            }
            try {
                const { code, message, result } = await this.$http.post("/user/login", loginParams)
                if (code != 0) {
                    console.error("登录失败！")
                    ElMessage.error('登录失败！')
                    return
                }
                ElMessage({
                    message: '登录成功！',
                    type: 'success',
                })
                // 登录成功后回到主页
                this.$router.push({
                    name: "home"
                })
            } catch (err) {
                console.error("登录失败！")
                ElMessage.error('登录失败！')
            }
        }
    }
}
</script>

<style scoped>
.container {
    background-color: #595959;
    width: 100%;
    height: 100%;
    position: absolute;
    inset: 0;
}

#title {
    text-align: center;
    color: azure;
    margin-top: 200px;
}

.input {
    margin: 20px auto;
    width: 500px;
}
</style>