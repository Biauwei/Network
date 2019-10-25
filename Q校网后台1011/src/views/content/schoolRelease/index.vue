<template>
  <div class="page">
    <div class="page-hd"></div>
    <div class="page-bd">
      <template>
        <el-table :data="tableData" style="width: 100%" size="mini">
          <el-table-column label="内容ID" prop="contentId" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column label="内容标题" prop="title" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span
                style="color:#409EFF;cursor:pointer;"
                @click="handleViewInfo(scope.row)"
              >{{ scope.row.title }}</span>
            </template>
          </el-table-column>
          <el-table-column label="栏目名称" prop="channelName" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span v-if="scope.row.channelName === null">无</span>
              <span v-else>{{ scope.row.channelName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="审核状态" prop="status" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span v-if="scope.row.status === 0" style="color:#409EFF">待审核</span>
              <span v-else-if="scope.row.status === 1" style="color:#67C23A">审核通过</span>
              <span v-else style="color:#F56C6C;">审核不通过</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="handlePass(scope.row, 1)">通过</el-button>
              <el-button size="mini" type="danger" @click="handlePass(scope.row, 2)">不通过</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </div>
    <div class="page-ft">
      <!-- 分页 -->
      <template>
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
      </template>
    </div>
    <div class="release">
      <!-- 查看上传详情信息 -->
      <template>
        <el-dialog width="60%" title=" 查看上传详情信息" top="40px" :visible.sync="dialogView">
          <el-row :gutter="10" type="flex" class="row-bg">
            <div class="one">
              <div class="image-box" v-if="info.showType == 3">
                <el-carousel height="589px" :autoplay="false">
                  <el-carousel-item v-for="(item, index) in info.images" :key="index">
                    <img :src="item.url" class="image" width="400" height="589" :alt="item.name">
                  </el-carousel-item>
                </el-carousel>
              </div>
              <template v-if="info.showType === 4">
                <div class="video-box">
                  <video :src="info.videoUrl" controls width="400" height="230"></video>
                </div>
              </template>
              <div class="image-box" v-if="info.showType == 4 || info.showType == 5">
                <el-carousel height="359px" :autoplay="false">
                  <el-carousel-item v-for="(item, index) in info.images" :key="index">
                    <img :src="item.url" class="image" width="400" height="359" :alt="item.name">
                  </el-carousel-item>
                </el-carousel>
              </div>
              <template v-if="info.showType === 5">
                <div class="video-box">
                  <video :src="info.videoUrl" controls width="400" height="230"></video>
                </div>
              </template>
            </div>
            <div class="two">
              <div class="list">
                <p>
                  标题：
                  <span>{{ info.title }}</span>
                </p>
                <p>
                  内容类型：
                  <span v-if="info.contentType === 0">全屏播放</span>
                  <span v-else>滚动播放</span>
                </p>
                <template v-if="info.contentType === 0">
                  <p>
                    内容属性：
                    <span v-if="info.contentProperty === 0">原创</span>
                    <span v-else>摘要</span>
                  </p>
                  <p>
                    作者：
                    <span v-if="info.author">{{ info.author }}</span>
                    <span v-else>无</span>
                  </p>
                  <p>
                    播放时长：
                    <span>{{ info.durationTime }}</span>
                  </p>
                  <p>
                    展示类型：
                    <span v-if="info.showType === 0">纯海报方式</span>
                    <span v-else-if="info.showType === 1">上视频下海报方式</span>
                    <span v-else-if="info.showType === 2">上海报下视频方式</span>
                    <span v-else-if="info.showType === 3">纯图片</span>
                    <span v-else-if="info.showType === 4">上视频下图片</span>
                    <span v-else>上图片下视频</span>
                  </p>
                </template>
                <template v-else>
                  <p>
                    播放有效期：
                    <span>{{ info.playTime }} 至 {{ info.endTime }}</span>
                  </p>
                  <p v-if="info.contentType === 1">
                    滚动内容：
                    <span>{{ info.rollContent }}</span>
                  </p>
                </template>
              </div>
            </div>
          </el-row>
        </el-dialog>
      </template>
    </div>
  </div>
</template>
<script>
import service from "@/api";
import pageMixins from "@/mixins/page";
export default {
  name: "schoolRelease",
  mixins: [pageMixins],
  data() {
    return {
      dialogView: false,
      info: {}
    };
  },
  methods: {
    handleCurrentChange(curr) {
      this.query.page = curr;
      this.schoolCheckQueryPrepublishContentList();
    },
    handleSizeChange(size) {
      this.query.pageSize = size;
      this.schoolCheckQueryPrepublishContentList();
    },
    handleViewInfo(row) {
      this.queryContentByContentId(row.contentId);
    },
    handlePass(row, n) {
      let obj = {};
      n === 1 ? (obj.status = 1) : (obj.status = 2);
      obj.contentId = row.contentId;
      this.schoolCheckContent(obj);
    },
    handleRelease(row) {
      let { status, contentId } = row;
      this.$confirm(`确定要发布内容吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.schoolCheckContent({ status, contentId });
        })
        .catch(error => {
          return false;
        });
    },
    //学校审核
    async schoolCheckContent(params = {}) {
      let res = await service.schoolCheckContent(params);
      if (res.errorCode === 0) {
        this.$message({ message: `${res.errorMsg}`, type: "success" });
        this.schoolCheckQueryPrepublishContentList();
      }
    },
    //学校待审核内容列表
    async schoolCheckQueryPrepublishContentList() {
      let res = await service.schoolCheckQueryPrepublishContentList(this.query);
      if (res.errorCode === 0) {
        this.tableData = res.data.data;
        this.totalCount = res.data.totalCount;
      }
    },
    //查询上传内容信息
    async queryContentByContentId(contentId) {
      let res = await service.queryContentByContentId({ contentId });
      if (res.errorCode === 0) {
        this.info = Object.assign({}, res.data);
        this.dialogView = true;
      }
    }
  },
  activated() {
    this.schoolCheckQueryPrepublishContentList();
  }
};
</script>
<style lang="less" scoped>
</style>
