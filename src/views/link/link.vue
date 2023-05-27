<template>
  <div>
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>友链管理</span>
        </div>
      </template>
      <el-form :inline="true" :model="linkInfo" class="link_box">
        <el-form-item label="网站名称" style="font-weight: 600">
          <el-input v-model="linkInfo.site_name" aria-placeholder="请输入网址名称" placeholder="请输入网址名称" />
        </el-form-item>
        <el-form-item label="申请时间">
          <el-date-picker
            v-model="time"
            type="daterange"
            range-separator="到"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            @change="dateChange"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">
            <el-icon><Search /></el-icon>
            <span>搜索</span>
          </el-button>
          <el-button @click="onFresh">
            <el-icon><Refresh /></el-icon>
            <span>重置</span>
          </el-button>
        </el-form-item>
      </el-form>
      <el-form-item style="margin-bottom: 1rem; padding-left: 24px">
        <el-button type="danger" size="small" @click="deleteList">
          <el-icon><Delete /></el-icon>
          批量删除
        </el-button>
        <el-button type="primary" size="small" v-if="activeTabName == '2'" @click="checkLink">
          <el-icon><Finished /></el-icon>
          批量审核
        </el-button>
      </el-form-item>
      <!-- tab -->
      <el-tabs v-model="activeTabName" class="demo-tabs" @tab-click="handleTabClick" style="padding-left: 24px">
        <el-tab-pane label="所有友链" name="1">
          <keep-alive>
            <TabTable :commList="linkList" @handleRowClick="handleRowClick" @getMultipData="getDeleteList" />
          </keep-alive>
        </el-tab-pane>
        <el-tab-pane label="待审核" name="2">
          <keep-alive>
            <TabTable :commList="examineLinkList" @handleRowClick="handleRowClick" @getMultipData="getDeleteList" />
          </keep-alive>
        </el-tab-pane>
        <el-tab-pane label="审核通过" name="3">
          <keep-alive>
            <TabTable :commList="successLinkList" @handleRowClick="handleRowClick" @getMultipData="getDeleteList" />
          </keep-alive>
        </el-tab-pane>
      </el-tabs>
      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          v-model:current-page="linkInfo.current"
          :page-sizes="[5, 10, 15, 20]"
          :page-size="linkInfo.size"
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
    <!-- 修改对话框 -->
    <el-dialog v-model="dialogVisible" title="修改友链" width="50%" draggable @close="modalCloseHardler">
      <el-form width="50%" ref="ruleFormRef" :model="formData" :rules="rules" label-width="80px" class="ruleForm" status-icon>
        <!-- sart form -->
        <el-form-item label="网站名称" prop="site_name">
          <el-input v-model="formData.site_name" type="text" />
        </el-form-item>
        <el-form-item label="网站描述" prop="site_desc">
          <el-input v-model="formData.site_desc" type="text" />
        </el-form-item>
        <el-form-item label="网站地址" prop="url">
          <el-input v-model="formData.url" type="text" />
        </el-form-item>
        <el-form-item label="网站头像" prop="site_avatar">
          <el-input v-model="formData.site_avatar" type="text" />
        </el-form-item>
        <!-- end form -->
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="dialogDataHardler"> 确定 </el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 删除对话框 start -->
    <el-dialog v-model="dialogDelete" width="40%" :before-close="handleClose" title="提示" top="25vh">
      <span>是否删除？</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogDelete = false">取消</el-button>
          <el-button type="primary" @click="deleteLink"> 确定 </el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 删除对话框 end -->
    <!-- 审核对话框 start -->
    <el-dialog v-model="dialogCheck" width="40%" :before-close="handleClose" title="提示" top="25vh">
      <span>是否通过？</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogCheck = false">取消</el-button>
          <el-button type="primary" @click="goCheckLink"> 确定 </el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 审核对话框 end -->
  </div>
</template>

<script>
import Header from "@/components/header.vue";
import TabTable from "@/components/TabTable.vue";
import moment from "moment";
export default {
  data() {
    return {
      // 友链获取列表
      linkList: [],
      // 待审核列表
      examineLinkList: [],
      // 审核通过列表
      successLinkList: [],
      // 友链查询默认参数
      linkInfo: {
        site_name: "",
        status: "",
        current: 1,
        size: 5,
      },
      time: [],
      total: 0, // 总数
      activeTabName: "1", // tab标签默认关联
      dialogVisible: false,
      formData: {}, // 修改时候的临时数据
      dialogDelete: false, // 删除对话框
      dialogCheck: false, // 审核对话框
      idList: [], // 删除id
      // 分页相关
      pagination: {
        small: true,
        background: true,
      },
      // 验证表达
      rules: {
        site_name: [
          { required: true, message: "请输入网站名", trigger: "blur" },
          { min: 3, max: 245, message: "长度区间3-245", trigger: "blur" },
        ],
        site_desc: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 245, message: "长度区间3-245", trigger: "blur" },
        ],
        url: [
          { required: true, message: "请输入网站地址", trigger: "blur" },
          { min: 3, max: 245, message: "长度区间3-245", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getLinkList();
  },
  methods: {
    // 获取所有友链列表
    async getLinkList() {
      let params = this.linkInfo;
      params.status = "";
      this.time.length != 0 &&
        Object.assign(params, {
          time: this.time,
        });
      try {
        let { message, result } = await this.$http.post("/links/getLinksList", params);
        let { list, ...res } = result;
        this.linkList = list;
        this.linkInfo.current = res.current;
        this.total = res.total;
        this.linkInfo.size = res.size;
      } catch (err) {
        const { message } = err.response.data;
        this.$message({
          type: "error",
          message,
        });
      }
    },
    // 获取待审核友链列表
    async getExamineLinkList() {
      let params = this.linkInfo;
      params.status = "0";
      params.current = 1;
      this.time.length != 0 &&
        Object.assign(params, {
          time: this.time,
        });
      let { message, result } = await this.$http.post("/links/getLinksList", params);
      let { list, ...res } = result;
      this.linkInfo.current = res.current;
      this.total = res.total;
      this.linkInfo.size = res.size;
      this.examineLinkList = list;
    },
    // 获取通过审核友链列表
    async getSuccessLinkList() {
      let params = this.linkInfo;
      params.status = "1";
      params.current = 1;
      this.time.length != 0 &&
        Object.assign(params, {
          time: this.time,
        });
      let { message, result } = await this.$http.post("/links/getLinksList", params);
      let { list, ...res } = result;
      this.linkInfo.current = res.current;
      this.total = res.total;
      this.linkInfo.size = res.size;
      this.successLinkList = list;
    },
    // tab标签切换数据更改
    async handleTabClick(value) {
      // 1 所有 2 待审核 3 审核通过
      const { name } = value.props;
      try {
        if (name == 1) {
          this.getLinkList();
          console.log(this.linkInfo);
        }
        if (name == 2) {
          this.getExamineLinkList();
          console.log(this.linkInfo);
        }
        if (name == 3) {
          this.getSuccessLinkList();
          console.log(this.linkInfo);
        }
      } catch (err) {
        const { message } = err.response.data;
        this.$message({
          type: "error",
          message,
        });
      }
    },
    // 修改逻辑
    handleRowClick(value) {
      // console.log(value)
      this.dialogVisible = true;
      this.formData = {
        id: value.id,
        url: value.url,
        site_name: value.site_name,
        site_desc: value.site_desc,
        site_avatar: value.site_avatar,
        status: value.status,
      };
    },
    // 弹窗数据修改
    async dialogDataHardler() {
      this.$refs.ruleFormRef.validate(async (valid) => {
        if (!valid) {
          this.$message.warning("请按提示信息填写内容！");
          return;
        } else {
          try {
            let { message } = await this.$http.post("/links/addOrUpdateLinks", this.formData);
            // @bug 每次修改都放回 性能消耗过大 (fix:服务器请求的浪费)
            // this.getLinkList();
            const { id } = this.formData;
            this.linkList = this.linkList.map((item) => (item.id === id ? Object.assign(item, this.formData) : item));
            this.examineLinkList = this.examineLinkList.map((item) =>
              item.id === id ? Object.assign(item, this.formData) : item
            );
            this.successLinkList = this.successLinkList.map((item) =>
              item.id === id ? Object.assign(item, this.formData) : item
            );
            this.$message({
              type: "success",
              message,
            });
          } catch (err) {
            const { message } = err.response.data;
            this.$message({
              type: "error",
              message,
            });
          }
          this.dialogVisible = false;
        }
      });
    },
    // (获取子组件传递的参数) 返回数据选中数据数组格式
    getDeleteList(multips) {
      let idList = multips.value.map((item) => {
        return item.id;
      });
      // 将删除id传出去
      this.idList = idList;
    },
    // 批量删除按钮逻辑
    deleteList() {
      console.log(this.idList);
      if (this.idList.length === 0) {
        this.$message({
          type: "warning",
          message: "请选中数据！",
        });
        return;
      }
      this.dialogDelete = true;
    },
    // 批量审核友链逻辑
    async checkLink() {
      console.log(this.idList);
      if (this.idList.length === 0) {
        this.$message({
          type: "warning",
          message: "请选中数据！",
        });
        return;
      }
      this.dialogCheck = true;
    },
    // 真实删除友链
    async deleteLink() {
      try {
        let params = this.idList.map((item) => item);
        let { message, result: count } = await this.$http.put("/links/delete", {
          idList: params,
        });
        // @bug(性能消耗过大) @fix 服务端改客户端 避免过度请求
        // this.getExamineLinkList();
        // this.getLinkList();
        // this.getSuccessLinkList();
        this.linkList = this.linkList.filter((item) => !params.includes(item.id));
        this.examineLinkList = this.examineLinkList.filter((item) => !params.includes(item.id));
        this.successLinkList = this.successLinkList.filter((item) => !params.includes(item.id));
        this.total = this.total - count;
        this.dialogDelete = false;
        this.$message.success(`删除成功！删除了${count}个数据!`);
      } catch (err) {
        this.$message({
          type: "error",
          message: "删除失败",
        });
      }
    },
    // 真实审核友链
    async goCheckLink() {
      try {
        let params = this.idList.map((item) => item);
        let { message, result: count } = await this.$http.put("/links/approve", {
          idList: params,
        });
        // @bug
        // this.getExamineLinkList();
        this.examineLinkList = this.examineLinkList.filter((item) => !params.includes(item.id));
        this.total = this.total - count;
        this.$message.success(`审核成功！通过了${count}个数据`);
        this.dialogCheck = false;
      } catch (err) {
        this.$message.error("审核通过失败");
      }
    },
    // 当前页改变
    async handleCurrentChange(value) {
      this.linkInfo.current = value;
      this.commonPage();
    },
    // 当前页数改变
    async handleSizeChange(value) {
      this.linkInfo.size = value;
      this.commonPage();
    },
    // 日期改变
    async dateChange(arr) {
      if (arr == null)  return;
      this.time = arr.map((item) => {
        return moment(item).format("YYYY-MM-DD HH:mm:ss");
      });
      console.log(this.time)
    },
    // 搜索
    async search() {
      try {
        this.commonPage();
        this.$message.success("搜索成功!");
      } catch (error) {}
    },
    // 重置
    async onFresh() {
      this.time = [];
      this.linkInfo = {
        site_name: "",
        status: "",
        current: 1,
        size: 5,
      };
    },
    // 公共分页查询
    async commonPage() {
      try {
        let params = {};
        // 如果标签页切换的是不同的 所对应的状态也不同
        if (this.activeTabName === "1") {
        } else if (this.activeTabName === "2") {
          params.status = "0";
        } else if (this.activeTabName === "3") {
          params.status = "1";
        }
        this.time.length != 0 &&
          Object.assign(params, {
            time: this.time,
          });

        this.linkInfo && Object.assign(params, this.linkInfo);
        let { message, result } = await this.$http.post("/links/getLinksList", params);
        const { list, current, size, total } = result;
        this.total = total;
        this.size = size;
        this.current = current;
          // 将不同状态分页数据给对应的数组中去
        if (this.activeTabName === "1") {
          this.linkList = list;
        } else if (this.activeTabName === "2") {
          this.examineLinkList = list;
        } else if (this.activeTabName === "3") {
          this.successLinkList = list;
        }
      } catch (err) {
        this.$message.error("查询错误！")
      }
    },
  },
  watch: {
    // 事件侦听器
    time(newValue, oldValue) {
      if (newValue == null) {
        this.time = [];
      }
    },
    activeTabName() {
      this.commonPage();
    },
  },
  components: {
    Header,
    TabTable,
  },
};
</script>

<style scoped>
.link_box {
  padding: 24px;
  padding-bottom: 0;
}
.pagination {
  width: 100%;
  margin: 16px 0px;
  display: flex;
  justify-content: flex-end;
}
</style>
