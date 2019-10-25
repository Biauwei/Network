<template>
  <div class="page">
    <div class="portalweb">
      <template>
        <el-row :gutter="10">
          <el-col :span="24">
            <el-tabs class="qx-page-tabs" type="border-card" @tab-click="handleClick">
              <el-tab-pane label="待审核" name="0">
                <el-table :data="tableData" style="width: 100%" stripe size="small">
                  <el-table-column label="学校ID" prop="schoolId" :show-overflow-tooltip="true"></el-table-column>
                  <el-table-column label="学校名称" prop="name" :show-overflow-tooltip="true"></el-table-column>
                  <el-table-column label="区域" prop="name" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                      <span>
                        {{ scope.row.provinceName }}
                        {{ scope.row.cityName }}
                        {{ scope.row.regionName }}
                      </span>
                    </template>
                  </el-table-column>
                  <el-table-column label="审核状态" prop="status" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                      <span v-if="scope.row.status === 0" style="color:#409EFF">待审核</span>
                      <span v-else-if="scope.row.status === 1" style="color:#409EFF">审核通过</span>
                      <span v-else style="color:#F56C6C;">审核不通过</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作">
                    <template slot-scope="scope">
                      <el-button size="mini" type="primary" @click="handleAudit(scope.row)">预览审核</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
              <el-tab-pane label="已审核" name="1">
                <el-table :data="tableData2" style="width: 100%" stripe size="small">
                  <el-table-column label="学校ID" prop="schoolId" :show-overflow-tooltip="true"></el-table-column>
                  <el-table-column label="学校名称" prop="name" :show-overflow-tooltip="true"></el-table-column>
                  <el-table-column label="区域" prop="name" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                      <span>
                        {{ scope.row.provinceName }}
                        {{ scope.row.cityName }}
                        {{ scope.row.regionName }}
                      </span>
                    </template>
                  </el-table-column>
                  <el-table-column label="审核状态" prop="status" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                      <span v-if="scope.row.status === 0" style="color:#409EFF">待审核</span>
                      <span v-else-if="scope.row.status === 1" style="color:#67C23A">审核通过</span>
                      <span v-else style="color:#F56C6C;">审核不通过</span>
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
            </el-tabs>
          </el-col>
        </el-row>
      </template>
      <!-- swiper -->
      <template>
        <el-dialog width="60%" title="预览审核" top="40px" :visible.sync="dialogView">
          <el-row :gutter="10" type="flex" class="row-bg">
            <div class="one">
              <el-carousel height="736px" :autoplay="false">
                <el-carousel-item v-for="(item, index) in swiperSlides" :key="index">
                  <div class="slide-item" v-html="item.text"></div>
                </el-carousel-item>
              </el-carousel>
            </div>
            <div class="two">
              <div class="list">
                <p>
                  学校名称：
                  <span>{{ info.name }}</span>
                </p>
                <p>
                  区域：
                  <span>{{ info.provinceName }}-{{info.cityName}}-{{info.regionName}}</span>
                </p>
                <p>
                  上传时间：
                  <span>{{ info.postTime }}</span>
                </p>
              </div>
              <el-form
                ref="check"
                label-position="left"
                :model="form"
                status-icon
                size="mini"
                :label-width="formLabelWidth"
              >
                <el-form-item label="是否通过" prop="name">
                  <el-radio-group v-model="form.status">
                    <el-radio :label="1">通过</el-radio>
                    <el-radio :label="2">不通过</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="审核意见" prop="verifyDescrition">
                  <el-input type="textarea" v-model="form.description" :rows="5" placeholder="审核意见"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button size="small" @click="dialogView = false">取消</el-button>
                  <el-button size="small" type="primary" @click="formSubmit('check')">审核</el-button>
                </el-form-item>
              </el-form>
            </div>
          </el-row>
        </el-dialog>
      </template>
    </div>
  </div>
</template>
<script>
import service from "@/api";
export default {
  name: "portalAudit",
  data() {
    return {
      dialogView: false,
      formLabelWidth: "100px",
      query: {
        status: 0
      },
      form: {
        schoolId: null,
        status: 1,
        description: ""
      },
      info: {},
      swiperSlides: [],
      tableData: [],
      tableData2: []
    };
  },
  computed: {
    swiper() {
      return this.$refs.mySwiper.swiper;
    }
  },
  methods: {
    handleClick(tab) {
      if (tab.name == 0) {
        this.query.status = 0;
      } else {
        this.query.status = 1;
      }
      this.queryCheckPortalWeb();
    },
    handleAudit(row) {
      this.info = { ...row };
      this.queryCheckPortalWebInfo(row.schoolId);
    },
    formSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.checkPortalWeb(this.form);
        } else {
          return false;
        }
      });
    },
    //查询所有学校的门户
    async queryCheckPortalWeb() {
      let res = await service.queryCheckPortalWeb(this.query);
      if (res.errorCode === 0) {
        if (this.query.status == 0) {
          this.tableData = res.data;
        } else {
          this.tableData2 = res.data;
        }
      }
    },
    //查询学校的门户内容
    async queryCheckPortalWebInfo(schoolId) {
      let res = await service.queryCheckPortalWebInfo({ schoolId });
      if (res.errorCode === 0) {
        this.dialogView = true;
        this.swiperSlides = res.data;
        this.form.schoolId = res.data[0].schoolId;
      }
    },
    //审核学校的门户内容
    async checkPortalWeb(params = {}) {
      let res = await service.checkPortalWeb(params);
      if (res.errorCode === 0) {
        this.dialogView = false;
        this.$message({ message: `审核成功`, type: "success" });
      }
    }
  },
  activated() {
    this.queryCheckPortalWeb();
  }
};
</script>
<style lang="less" scoped>
.row-bg {
  > div {
    margin: 0 15px;
  }
  .one {
    width: 520px;
    padding: 10px;
    box-shadow: 0 16px 16px 0 rgba(0, 0, 0, 0.12),
      0 0 16px 0 rgba(0, 0, 0, 0.04);
  }
  .two {
    flex: 1;
  }
}
.slide-item {
  height: 736px;
  p {
    letter-spacing: 1px;
  }
}
.list {
  font-size: 14px;
  margin-bottom: 50px;
  color: #333;
  p {
    padding: 8px 0;
    border-bottom: 1px solid rgba(220, 223, 230, 0.5);
  }
  span {
    color: #409eff;
    line-height: 1.6;
  }
}
</style>
