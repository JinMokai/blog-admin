<template>
  <div v-loading="loading">
    <el-card>
      <template #header>
        <div>
          <span>首页</span>
        </div>
      </template>
      <div class="card_index">
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
      <div class="box" style="width: 100%; height: 100%;display: flex;gap: 1rem;">
        <div class="left" ref="leftRef" style="height: 500px;flex: 1;"></div>
        <!-- <div class="right" ref="rightRef" style="height: 500px;flex: 1;"></div> -->
      </div>
    </el-card>
  </div>
</template>

<script>
import * as echarts from "echarts/core";
import { GridComponent } from "echarts/components";
import { BarChart } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";
echarts.use([GridComponent, BarChart, CanvasRenderer]);
export default {
  created() {
    this.getStaticList();
  },
  data() {
    return {
      listTotal: {},
      // 每年文章数量
      listYear: [],
      // 网站每月访问数量
      monthCount: [],
      loading: true,
    };
  },
  methods: {
    // 获取静态数据
    getStaticList() {
      this.$http
        .get("/static")
        .then((res) => {
          if (res.code == 0) {
            this.listTotal = res.result;
          }
        })
        .catch((error) => {
          this.$message.error("请求静态数据出错");
          console.error("请求静态数据出错", error);
        });
    },
    // 获取每年文章数量
    async getListYear() {
      try {
        const { result } = await this.$http.get("/static/year");
        this.listYear = result;
        console.log(this.listYear);
      } catch (err) {
        this.$message.error("获取文章数量出错");
      }
    },
    // 获取网站每月访问数量
    async getMonthCount() {
      try {
        const { result } = await this.$http.get("/static/month");
        this.monthCount = result;
        console.log(this.monthCount, 'ch')
      } catch (err) {
        this.$message.error("获取完整访问量出错");
      }
    },
    // 初始化Echarts left
    initEcharts() {
      const OptionLeft = {
        xAxis: {
          data: this.listYear.map((item) => String(item.year)).reverse(),
          name: "年份",
        },
        yAxis: {
          type: "value",
          name: "文章数量",
        },
        series: [
          {
            data: this.listYear.map((item) => String(item.article_count)).reverse(),
            type: "bar",
          },
        ],
      };
      const myChart = echarts.init(this.$refs.leftRef);
      myChart.setOption(OptionLeft);
    },
    // 初始化Echarts right
    // initEchartsRight() {
    //   const OptionRight = {
    //     xAxis: {
    //       data: this.monthCount.map((item) => String(item.month)).reverse(),
    //       name: "月份",
    //     },
    //     yAxis: {
    //       type: "value",
    //       name: "访问量",
    //     },
    //     series: [
    //       {
    //         data: this.monthCount.map((item) => String(item.view_count)).reverse(),
    //         type: "bar",
    //       },
    //     ],
    //   };
    //   const myChart = echarts.init(this.$refs.rightRef);
    //   myChart.setOption(OptionRight);
    // },
  },
  mounted() {
    this.loading = false;
    // fix 异步数据加载完再加载数据
    Promise.all([this.getListYear()])
      .then(() => {
        this.initEcharts();
        // this.initEchartsRight();
      })
      .catch((error) => {
        this.$message.error("获取静态数据或文章数量出错");
        console.error("获取静态数据或文章数量出错", error);
      });
  },
};
</script>

<style scoped>

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
