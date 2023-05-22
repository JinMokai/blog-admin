<template>
    <div>
        <div class="card_header">
            <h1>用户管理</h1>
        </div>
        <el-form :inline="true" :model="userInfo" class="user_box">
            <el-form-item label="用户名" style="font-weight: 600;">
                <el-input v-model="userInfo.username" placeholder="请输入用户名" />
            </el-form-item>
            <el-form-item label="用户角色" style="font-weight: 600;">
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
            <el-table-column prop="id" label="序号" width="150" />
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
                    <el-switch v-model="scope.row.role" :active-value="'1'" :inactive-value="'2'" size="large"
                        active-text="管理员" inactive-text="普通用户" @change="switchChange(scope.row)" />
                </template>
            </el-table-column>
            <el-table-column prop="status" label="是否禁用" width="220" align="center">
                <template #default="scope">
                    <el-switch v-model="scope.row.status" :active-value="'1'" :inactive-value="'0'" size="large"
                        active-text="不禁用" inactive-text="禁用" @change="statusChange(scope.row)" />
                </template>
            </el-table-column>
            <el-table-column prop="created" label="创建时间" width="300" align="center" />
            <el-table-column fixed="right" label="操作" width="120">
                <template #default>
                    <el-button :icon="Edit" link type="primary" size="small" @click="handleClick">
                        <el-icon>
                            <EditPen />
                        </el-icon>
                        修改</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination">
                <el-pagination v-model:current-page="currentPage4" v-model:page-size="pageSize4"
                    :page-sizes="[10, 15, 20]" :small="small" :disabled="disabled" :background="background"
                    layout="total, sizes, prev, pager, next, jumper" :total="400" @size-change="handleSizeChange"
                    @current-change="handleCurrentChange" />
            </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            userList: [],
            userInfo: {
                username: '',
                region: '',

            },
            // 默认当前页
            current: 1,
            // 默认每页五个数据
            size: 10,
            loading: true,
            small: true,
            total: 0
        }
    },
    created() {
        this.$http.post("/user/getUserList", { current: this.current, size: this.size, username: this.userInfo.username, role: this.userInfo.region })
            .then(res => {
                console.log(res)
                this.total = res.result.total
                this.current = res.result.current
                this.size = res.result.size
                if (res.code == 0) {
                    this.userList = res.result.list
                    this.loading = false
                }
            }).catch(error => {
                this.$message({
                    message: "获取用户信息失败",
                    type: "error"
                })
                console.error("获取用户信息失败", error)
            })
    },
    methods: {
        onSearch() {
            console.log(this.userInfo)
        },
        // 开关切换 通过插槽获取id和权限
        async switchChange({ id, role }) {
            try {
                let res = await this.$http.put(`/user/updateRole/${id}/${role}`)
                if (res.code == 0) {
                    this.$message({
                        message: res.message,
                        type: "success"
                    })
                } else {
                    this.$message({
                        message: "修改失败",
                        type: "error"
                    })
                }
            } catch (err) {
                console.error("修改失败")
                this.$message({
                    message: "修改失败",
                    type: "error"
                })
            }
        },
        async statusChange({ id, status }) {
            try {
                // 禁用
                if (status == 0) {
                    let res = await this.$http.post(`/user/disableUser/${id}`)
                    this.$message({
                        message: res.message,
                        type: "success"
                    })
                }
                if (status == 1) {
                    let res = await this.$http.post(`/user/activeUser/${id}`)
                    this.$message({
                        message: res.message,
                        type: "success"
                    })
                }
            } catch (err) {
                this.$message({
                    message: "禁用用户失败",
                    type: "error"
                })
            }
        }
    },
    computed: {

    }
}
</script>

<style scoped>
.card_header {
    padding: 18px;
    border-bottom: 1px solid rgb(228, 231, 237);
    font-size: 1.2em;
    box-sizing: border-box;
}

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