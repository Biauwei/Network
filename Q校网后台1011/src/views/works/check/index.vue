
<template>
  <div class="page">
    <div class="page-hd">
      <div class="page-form">
        <el-form
          class="demo-form-inline"
          :inline="true"
          :model="query"
          size="small"
          label-width="70px"
          label-position="left"
        >
          <el-form-item label="作品类别">
            <el-select v-model="query.type" placeholder="选择作品类别">
              <el-option
                v-for="item in worksTypeList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="审核状态">
            <el-select v-model="query.checkStage">
              <el-option
                v-for="item in checkStageLists"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="审核时间">
            <el-date-picker
              v-model="query.startTime"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button size="small" icon="el-icon-search" type="primary" @click="handleSearch">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="page-bd">
      <!-- 表格数据 -->
      <el-table :data="tableData" style="width: 100%" size="small">
        <el-table-column
          :key="Math.random()"
          v-if="!isShow"
          label="作品集ID"
          prop="collectionId"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column v-if="isShow" label="作品ID" prop="worksId" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column v-if="isShow" label="作品" prop="imageUrl" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <img :src="scope.row.imageUrl" alt style="width:40px;height:40px">
          </template>
        </el-table-column>
        <el-table-column label="作品标题" prop="title" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="作品类型" prop="type" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span size="mini" v-if="scope.row.type === 1">学生作品</span>
            <span size="mini" v-else-if="scope.row.type === 2">班级风采</span>
            <span size="mini" v-else>精选优品</span>
          </template>
        </el-table-column>
        <el-table-column label="所属学校" prop="schoolName" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column
          :key="Math.random()"
          v-if="isShow"
          label="审核意见"
          prop="verifyDescrition"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column label="上传时间" prop="postTime" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              :key="Math.random()"
              v-if="!isShow"
              size="mini"
              type="primary"
              @click="handleWorksInfo(scope.row.collectionId)"
            >查看</el-button>
            <el-button v-if="isShow" size="mini" type="danger" @click="handleDelWorks(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="page-ft">
      <!-- 分页 -->
      <div class="qx-pagination" v-if="totalCount">
        <el-pagination
          background
          small
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="query.page"
          :page-size="query.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalCount"
        ></el-pagination>
      </div>
    </div>
    <!-- 单独查看审核过的作品图片 -->
    <el-dialog custom-class="qx-dialog" title="作品集查看" :visible.sync="dialogWorksInner">
      <el-carousel
        ref="carousel"
        indicator-position="none"
        height="600px"
        :interval="500"
        :autoplay="false"
        :loop="false"
        arrow="always"
      >
        <el-carousel-item v-for="works in worksData" :key="works.worksId">
          <div class="works-pic" :style="{ backgroundImage: 'url(' + works.imageUrl +')' }"></div>
        </el-carousel-item>
      </el-carousel>
    </el-dialog>
    <!-- 作品集详情2 -->
    <el-dialog
      width="80%"
      top="20px"
      title="作品列表"
      :visible.sync="dialogWorks"
      @close="querys.page = 1"
    >
      <el-dialog
        width="70%"
        append-to-body
        title="审核作品"
        :visible.sync="dialogCheckWorks"
        @open="handleOpen"
        @close="handleClose"
      >
        <el-row :gutter="10" type="flex" class="row-bg">
          <div class="one" v-if="!isBatch">
            <div class="image-box">
              <el-carousel
                ref="carousel"
                height="400px"
                @change="changeCarousel"
                indicator-position="none"
                :autoplay="false"
                :loop="false"
                arrow="always"
              >
                <el-carousel-item v-for="works in worksData" :key="works.worksId">
                  <div class="cheetah" :style="{backgroundImage: 'url(' + works.imageUrl +')'}"></div>
                </el-carousel-item>
              </el-carousel>
            </div>
          </div>
          <div class="two">
            <template v-if="verifyStatus === 0">
              <el-form
                ref="check"
                label-position="left"
                :model="form"
                size="mini"
                :label-width="formLabelWidth"
              >
                <el-form-item label="是否通过" prop="verifyStatus">
                  <el-radio-group v-model="form.verifyStatus">
                    <el-radio :label="1">通过</el-radio>
                    <el-radio :label="2">不通过</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="审核意见" prop="verifyDescrition">
                  <el-input
                    type="textarea"
                    v-model="form.verifyDescrition"
                    :rows="5"
                    placeholder="审核意见"
                  ></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button size="small" @click="dialogCheckWorks = false">取消</el-button>
                  <el-button size="small" type="primary" @click="checkForm('check')">审核</el-button>
                </el-form-item>
              </el-form>
            </template>
            <template v-else>
              <p>本页作品已审核完成！您可切换图片审核其它作品。</p>
            </template>
          </div>
        </el-row>
        <span slot="footer" class="dialog-footer"></span>
      </el-dialog>
      <div class="table-tools">
        <el-button type="primary" size="mini" @click="handleBatchCheckWorks">批量审核</el-button>
      </div>
      <el-table
        ref="multipleTable"
        :data="worksData"
        style="width: 100%"
        stripe
        size="small"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" :selectable="handleSelectCheckbox"></el-table-column>
        <el-table-column prop="worksId" label="作品ID"></el-table-column>
        <el-table-column prop="smallUrl" label="图片">
          <template slot-scope="scope">
            <img
              :src="scope.row.smallUrl"
              style="width:40px;height:40px"
              @click="handleViewsImg(scope.$index)"
            >
          </template>
        </el-table-column>
        <el-table-column prop="verifyStatus" label="审核状态">
          <template slot-scope="scope">
            <span v-if="scope.row.verifyStatus === 0">待审核</span>
            <span v-else-if="scope.row.verifyStatus === 1">审核通过</span>
            <span v-else>审核不通过</span>
          </template>
        </el-table-column>
        <el-table-column prop="verifyDescrition" label="审核意见"></el-table-column>
        <el-table-column prop="verifyTime" label="审核时间"></el-table-column>
        <el-table-column prop="recommend" label="推荐">
          <template slot-scope="scope">
            <template v-if="scope.row.verifyStatus === 1">
              <!-- 审核通过 -->
              <el-switch
                active-color="#67c23a"
                :inactive-value="0"
                :active-value="1"
                v-model="scope.row.recommend"
                @change="handleChangeSwitch(scope.row)"
              ></el-switch>
            </template>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <template v-if="scope.row.verifyStatus === 0">
              <el-button
                size="mini"
                type="primary"
                @click="handleWorksCheck(scope.row, scope.$index)"
              >审核</el-button>
            </template>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-pagination
          background
          small
          @current-change="worksCurrentChange"
          :current-page="querys.page"
          :page-size="querys.pageSize"
          layout="total,prev, pager, next"
          :total="worksCount"
        ></el-pagination>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import service from "@/api";
import { checkStages, worksType } from "@/mixins";
import pageMixins from "@/mixins/page";
export default {
  name: "worksCheck",
  mixins: [checkStages, worksType, pageMixins],
  data() {
    return {
      carouselIndex: 0,
      verifyStatus: 0,
      worksId: null,
      isShow: false,
      isBatch: false, //是批量审核还是单独审核
      dialogCheckWorks: false,
      dialogWorks: false,
      dialogWorksInner: false,
      imageUrl: "",
      query: {
        type: 0,
        checkStage: 0,
        title: "",
        startTime: [],
        endTime: ""
      },
      querys: {
        collectionId: null,
        page: 1,
        pageSize: 8
      },
      form: {
        worksIds: [],
        verifyStatus: 1,
        verifyDescrition: ""
      },
      worksCount: 0,
      worksData: [],
      multipleSelection: []
    };
  },
  watch: {},
  methods: {
    handleCurrentChange(curr) {
      this.query.page = curr;
      this.queryWorksCollection(this.query);
    },
    handleSizeChange(size) {
      this.query.pageSize = size;
      this.queryWorksCollection(this.query);
    },
    handleSearch() {
      if (this.query.page !== 1) {
        this.query.page = 1;
      }
      this.queryWorksCollection(this.query);
    },
    worksCurrentChange(curr) {
      this.querys.page = curr;
      this.queryWorksDetailList(this.querys);
    },
    //作品集详情查询
    handleWorksInfo(collectionId) {
      this.querys.collectionId = collectionId;
      this.queryWorksDetailList(this.querys);
    },
    //删除不通过作品
    handleDelWorks(row) {
      this.deleteDetail({ worksIds: [row.worksId] });
    },
    handleClose() {
      this.verifyStatus = 0;
      this.queryWorksDetailList(this.querys);
    },
    //
    handleOpen() {
      if (!this.isBatch) {
        setTimeout(() => {
          this.$refs.carousel.setActiveItem(this.carouselIndex);
        }, 0);
      }
    },
    handleWorksCheck(row, index) {
      this.dialogCheckWorks = true;
      this.worksId = row.worksId;
      this.carouselIndex = index;
      this.isBatch = false;
    },
    handleChangeSwitch(row) {
      let { worksId, recommend } = row;
      this.recommendWorks({ recommend, worksIds: [worksId] });
    },
    //当幻灯片切换时
    changeCarousel(newIndex, oloIndex) {
      this.worksId = this.worksData[newIndex].worksId;
      this.queryWorksDetail(this.worksId);
    },
    handleSelectCheckbox(row, index) {
      return row.verifyStatus === 0 ? true : false;
    },
    handleViewsImg(index) {
      this.dialogWorksInner = true;
    },
    handleSelectionChange(selection) {
      this.multipleSelection = selection;
    },
    //批量审核
    async handleBatchCheckWorks() {
      if (!this.multipleSelection.length) {
        this.$message({ message: "请选择你要审核的作品", type: "warning" });
        return;
      }
      this.isBatch = true;
      this.dialogCheckWorks = true;
      this.form.worksIds = [];
      this.multipleSelection.forEach(elem => {
        this.form.worksIds.push(elem.worksId);
      });
    },
    checkForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.isBatch) {
          } else {
            this.form.worksIds = [];
            this.form.worksIds.push(this.worksId);
          }
          this.checkWorks(this.form);
        }
      });
    },
    //学生作品查询--审核列表
    async queryWorksCollection(params = {}) {
      let res = await service.queryWorksCollection(params, {
        headers: { "Content-Type": "application/json" }
      });
      if (res.errorCode === 0) {
        if (this.query.checkStage === 2) {
          this.isShow = true;
        } else {
          this.isShow = false;
        }
        this.tableData = res.data.data || [];
        this.totalCount = res.data.totalCount;
      }
    },
    //作品详情
    async queryWorksDetail(worksId) {
      let res = await service.queryWorksDetail(
        { worksId },
        {
          headers: { "Content-Type": "application/json" }
        }
      );
      if (res.errorCode === 0) {
        this.verifyStatus = res.data.verifyStatus;
      }
    },
    //作品集详情查询
    async queryWorksDetailList(params = {}) {
      let res = await service.queryWorksDetailList(params, {
        headers: { "Content-Type": "application/json" }
      });
      if (res.errorCode === 0) {
        this.dialogWorks = true;
        this.worksData = res.data.data || [];
        this.worksCount = res.data.totalCount;
      }
    },
    //作品审核
    async checkWorks(params = {}) {
      let res = await service.checkWorks(params, {
        headers: { "Content-Type": "application/json" }
      });
      if (res.errorCode === 0) {
        if (this.isBatch) {
          this.dialogCheckWorks = false;
        }
        this.$refs.check.resetFields();
        this.queryWorksDetail(this.worksId);
        //this.queryWorksDetailList(this.querys);
      }
    },
    //作品推荐
    async recommendWorks(params) {
      let res = await service.recommendWorks(params, {
        headers: { "Content-Type": "application/json" }
      });
      if (res.errorCode === 0) {
      }
    },
    //删除不通过作品
    async deleteDetail(params) {
      let res = await service.deleteDetail(params, {
        headers: { "Content-Type": "application/json" }
      });
      if (res.errorCode === 0) {
        this.queryWorksCollection(this.query);
      }
    }
  },
  activated() {
    this.queryWorksCollection(this.query);
  }
};
</script>
<style lang="less" scoped>
.table-tools {
  margin-bottom: 10px;
}
.works-pic {
  width: 600px;
  height: 100%;
  margin: 0 auto;
  position: relative;
  overflow: hidden;
  background-position: center center;
  background-repeat: no-repeat;
  background-size: contain;
}
.cheetah {
  height: 400px;
  overflow: hidden;
  background-repeat: no-repeat;
  background-position: center center;
  background-size: contain;
}
</style>
