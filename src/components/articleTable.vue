<template>
  <div v-if="!commList.length">暂无数据</div>
  <el-table v-else :data="commList" style="width: 100%" v-loading="loading" max-height="352px" border>
    <el-table-column type="index" label="序号" width="50" />
    <el-table-column prop="title" label="文章标题" width="120" show-overflow-tooltip> </el-table-column>
    <el-table-column prop="description" label="文章描述" width="120" show-overflow-tooltip> </el-table-column>
    <el-table-column prop="categaryName" label="文章分类" width="100" align="center" show-overflow-tooltip>
      <template #default="scope">
        <div>
          <el-tooltip effect="dark" placement="top-start">
            <template #content>
              {{ scope.row.categaryName }}
            </template>
            <el-tag class="ml-2" :type="success">
              {{ scope.row.categaryName }}
            </el-tag>
          </el-tooltip>
        </div>
      </template>
    </el-table-column>
    <el-table-column prop="is_top" label="是否置顶" width="200" align="center">
      <template #default="scope">
        <el-switch
          v-model="scope.row.is_top"
          size="large"
          active-text="置顶"
          inactive-text="不置顶"
          :active-value="'0'"
          :inactive-value="'1'"
          @change="$emit('switch', scope.row)"
        />
      </template>
    </el-table-column>
    <el-table-column prop="type" label="类型" width="100" align="center">
      <template #default="scope">
        <div>
          <el-tooltip effect="dark" placement="top-start">
            <template #content>
              {{ scope.row.type === 0 ? "原创" : "转载" }}
            </template>
            <el-tag class="ml-2" :type="success">
              {{ scope.row.type === 0 ? "原创" : "转载" }}
            </el-tag>
          </el-tooltip>
        </div>
      </template>
    </el-table-column>
    <el-table-column prop="view_count" label="文章访问量" width="100" align="center" />
    <el-table-column prop="like_count" label="文章点赞量" width="100" align="center" />
    <el-table-column prop="created" label="创建时间" width="200" align="center" />
    <el-table-column fixed="right" label="操作" width="220">
      <template #default="scope">
        <el-button :icon="Edit" link type="primary" size="small" @click="$emit('update', scope.row)">
          <el-icon>
            <EditPen />
          </el-icon>
          修改</el-button
        >
        <el-popconfirm :title="scope.row.status == 1 ? '确定公开?' : '确定隐藏?'" @confirm="$emit('public', scope)">
          <template #reference>
            <el-button :icon="View" link type="success" size="small" @click="">
              <template #default>
                <!-- 公开icon -->
                <span v-if="scope.row.status != 1">
                  <el-icon><View /></el-icon>
                  <span>公开</span>
                </span>
                <span v-else>
                  <!-- 隐藏icon -->
                  <el-icon><Hide /></el-icon>
                  <span>隐藏</span>
                </span>
              </template>
            </el-button>
          </template>
        </el-popconfirm>

        <el-popconfirm :title="scope.row.status == 0 ? '确定永久删除?' : '确定删除?'" @confirm="$emit('delete', scope.row)">
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
</template>

<script>
export default {
  props: {
    commList: Array,
  },
  data() {
    return {};
  },
  methods: {},
};
</script>

<style lang="scss" scoped></style>
