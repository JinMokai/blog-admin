<template>
  <div class="card_index" v-loading="loading">
    <div class="card_header">
      <h1>首页</h1>
    </div>
    <div class="el_row">
      <div class="el_row_item">
        <div class="row_item">
          <div class="item_box">
            <div class="item_box_content">
              <Document style="width: 48px; height: 48px" />
              <div class="box_content">
                <span class="label">文章</span>
                <div class="value">{{ listTotal.articleCount }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="el_row_item">
        <div class="row_item">
          <div class="item_box">
            <div class="item_box_content">
              <Files style="width: 48px; height: 48px" />
              <div class="box_content">
                <span class="label">分类</span>
                <div class="value">{{ listTotal.categaryCount }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="el_row_item">
        <div class="row_item">
          <div class="item_box">
            <div class="item_box_content">
              <User style="width: 48px; height: 48px" />
              <div class="box_content">
                <span class="label">用户</span>
                <div class="value">{{ listTotal.userCount }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="el_row_item">
        <div class="row_item">
          <div class="item_box">
            <div class="item_box_content">
              <PriceTag style="width: 48px; height: 48px" />
              <div class="box_content">
                <span class="label">留言</span>
                <div class="value">{{ listTotal.messageCount }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="el_row_item">
        <div class="row_item">
          <div class="item_box">
            <div class="item_box_content">
              <View style="width: 48px; height: 48px" />
              <div class="box_content">
                <span class="label">访问量</span>
                <div class="value">{{ listTotal.view_count }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  created() {
    this.$http
      .get("/static")
      .then((res) => {
        if (res.code == 0) {
          this.listTotal = res.result;
        }
      })
      .catch((error) => {
        this.$message({
          message: "请求静态数据出错",
          type: "error",
        });
        console.error("请求静态数据出错", error);
      });
  },
  data() {
    return {
      listTotal: {},
      loading: true,
    };
  },
  mounted() {
    this.loading = false;
  },
};
</script>

<style scoped>
.card_header {
  padding: 18px;
  border-bottom: 1px solid rgb(228, 231, 237);
  font-size: 1.2em;
  box-sizing: border-box;
}

.el_row {
  box-sizing: border-box;
  display: flex;
  flex-wrap: wrap;
  position: relative;
}

.el_row_item {
  display: block;
  flex: 0 0 20%;
  max-width: 25%;
}

.row_item {
  margin: 5px;
}

.item_box {
  padding: 20px;
  box-shadow: rgba(0, 0, 0, 0.12) 0px 0px 12px 0px;
}

.item_box_content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.box_content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  line-height: 24px;
}

.label {
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
}

.value {
  font-weight: 600;
  font-size: 1.6rem;
  cursor: pointer;
}
</style>
