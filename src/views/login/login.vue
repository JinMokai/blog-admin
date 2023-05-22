<template>
    <div class="container">
        <div id="title">
            <h1>博客后台管理系统</h1>
        </div>
        <div class="input">
            <el-input v-model="username" prefix-icon="User" placeholder="请输入用户名"></el-input>
        </div>
        <div class="input">
            <el-input v-model="password" prefix-icon="Lock" placeholder="请输入密码" show-password></el-input>
        </div>
        <div class="input">
            <el-button @click="login" style="width: 500px;" type="primary" :disabled="disabled">{{ isLogin ? '登录' : '注册'
            }}</el-button>
        </div>
        <p class="register"><span><a href="#" @click="toggleLoginStatus">{{ isLogin ? '快去注册' : '已有账号，去登录' }}</a></span>
        </p>
    </div>
</template>

<script>
export default {
    name: "Login",
    data() {
        return {
            username: "",
            password: "",
            isLogin: true
        }
    },
    computed: {
        // 如果用户名和密码为空就禁用登录
        disabled() {
            return this.username.length == 0 || this.password.length == 0
        },

    },
    methods: {
        toggleLoginStatus() {
            this.isLogin = !this.isLogin
        },
        // 登录逻辑
        async login() {
            const Params = {
                username: this.username,
                password: this.password
            }
            // 登录逻辑
            if (this.isLogin) {
                try {
                    const { code, result } = await this.$http.post("/user/login", Params)
                    const { token, ...user } = result
                    // 存储用户信息
                    this.$store.commit("auth/setUser", JSON.stringify(user))
                    this.$store.commit("auth/setToken", token)
                    this.$message({
                        message: '登录成功！',
                        type: 'success',
                    })
                    // 登录成功后回到主页
                    this.$router.push({
                        name: "home"
                    })
                } catch (err) {
                    const { code, message } = err.response.data
                    this.$message({
                        message,
                        type: "error"
                    })
                }
            } else {
                // 注册逻辑
                try {
                    const { code, ...res } = await this.$http.post("/user/register", Params)
                    this.$message({
                        message: res.message,
                        type: "success"
                    })
                } catch (err) {
                    const { code, message } = err.response.data
                    this.$message({
                        message,
                        type: "error"
                    })
                }
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

.register {
    color: white;
    margin: 20px auto;
    width: 500px;
}

.register a {
    color: ;
}
</style>