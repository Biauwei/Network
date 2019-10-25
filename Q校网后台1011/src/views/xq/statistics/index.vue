<template>
  <div class="page">
    <div class="page-bd">
      <el-row :gutter="10">
        <el-col :span="6">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>用户统计</span>
            </div>
            <el-row :gutter="10">
              <el-col :span="12">
                <div class="backlog-body">
                  <h3>当天新增用户</h3>
                  <p>{{ info.attentionToday }}</p>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="backlog-body">
                  <h3>总用户数</h3>
                  <p>{{ info.attentionCount }}</p>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="backlog-body">
                  <h3>当天记录人数</h3>
                  <p>{{ info.useCount }}</p>
                </div>
              </el-col>
            </el-row>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>班级统计</span>
            </div>
            <el-row :gutter="10">
              <el-col :span="12" v-for="(item, index) in list" :key="index">
                <div class="backlog-body">
                  <h3>{{ item.name }}</h3>
                  <p>今天发送数: {{ item.today }}</p>
                  <p>总数: {{ item.total }}</p>
                </div>
              </el-col>
            </el-row>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import service from "@/api";
export default {
  name: "statistics",
  data() {
    return {
      info: {},
      list: []
    };
  },
  methods: {
    //用户统计
    async statistics(params = {}) {
      let res = await service.statistics(params, {
        headers: { "Content-Type": "application/json" }
      });
      if (res.errorCode === 0) {
        this.info = res.data;
      }
    },
    //班级统计
    async classStatistics(params = {}) {
      let res = await service.classStatistics(params, {
        headers: { "Content-Type": "application/json" }
      });
      if (res.errorCode === 0) {
        this.list = res.data;
      }
    }
  },
  mounted() {
    this.statistics();
    this.classStatistics();
  }
};
</script>
<style lang="less" scoped>
.box-card {
  margin-top: 15px;
}
.backlog-body {
  display: block;
  padding: 10px 15px;
  background-color: #f8f8f8;
  color: #999;
  border-radius: 4px;
  transition: all 0.3s;
  margin-bottom: 10px;
  line-height: 1.6;
  h3 {
  }
  p {
    font-style: normal;
    font-size: 16px;
    font-weight: 300;
    color: #409eff;
  }
}
</style>
