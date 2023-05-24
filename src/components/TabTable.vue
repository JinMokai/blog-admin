<template>
  <el-table
    :data="commList"
    style="width: 100%"
    v-loading="loading"
    height="352px"
    @selection-change="handleSelectionChange"
    border
  >
  <el-table-column type="selection" width="55" />

    <el-table-column type="index" label="序号" width="50" />
    <el-table-column prop="site_avatar" label="网站头像" width="120">
      <template #default="scope">
        <div style="display: flex; align-items: center">
          <el-avatar :src="scope.row.site_avatar" />
        </div>
      </template>
    </el-table-column>
    <el-table-column prop="site_desc" label="网站描述" width="120" show-overflow-tooltip> </el-table-column>
    <el-table-column prop="url" label="网站地址" width="220" align="center" show-overflow-tooltip> </el-table-column>
    <el-table-column prop="status" label="状态" width="100" align="center">
      <template #default="scope">
        <div>
          <el-tooltip effect="dark" placement="top-start">
            <template #content>
              {{ scope.row.status === 0 ? "待审核" : "审核通过" }}
            </template>
            <el-tag class="ml-2" :type="scope.row.status === 0 ? 'danger' : 'success'">
              {{ scope.row.status === 0 ? "待审核" : "审核通过" }}
            </el-tag>
          </el-tooltip>
        </div>
      </template>
    </el-table-column>
    <el-table-column prop="created" label="创建时间" width="200" align="center" />
    <el-table-column prop="updated" label="更新时间" width="200" align="center" />
    <el-table-column fixed="right" label="操作" width="120">
      <template #default="scope">
        <el-button :icon="Edit" link type="primary" size="small" @click="$emit('handleRowClick', scope.row)">
          <el-icon>
            <EditPen />
          </el-icon>
          修改</el-button
        >
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  props: {
    commList: Array,
  },
  data() {
    return {
      // 多选框
      multipleSelection: [],
    };
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection.value = val;
      // 将每一次选中数据传递给父组件
      this.$emit("getMultipData", this.multipleSelection)
    },
  },
};
</script>

<style lang="scss" scoped></style>
