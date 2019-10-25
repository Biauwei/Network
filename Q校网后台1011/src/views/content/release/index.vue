<template>
  <div class="page">
    <div class="page-hd"></div>
    <div class="page-bd">
      <template>
        <el-row :gutter="10">
          <el-col :span="24">
            <el-tabs class="qx-page-tabs" type="border-card" @tab-click="handleClick">
              <el-tab-pane label="待发布" name="0">
                <!-- 表格数据 -->
                <template>
                  <el-table :data="tableData" style="width: 100%" size="small">
                    <el-table-column label="内容ID" prop="contentId" :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column label="内容标题" prop="title" :show-overflow-tooltip="true">
                      <template slot-scope="scope">
                        <span
                          style="color:#409EFF;cursor: pointer;"
                          @click="handleViewContent(scope.row)"
                        >{{ scope.row.title }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="栏目名称" prop="channelName" :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column label="申请人" prop="userName" :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column label="申请时间" prop="publishTime" :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column label="发布区域" prop="regionName" :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column label="发布学校" prop="schoolName" :show-overflow-tooltip="true">
                      <template slot-scope="scope">
                        <span
                          style="color:#409EFF;cursor:pointer;"
                          @click="handleViewSchool(scope.row)"
                        >查看</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="审核时间" prop="checkTime" :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column label="操作">
                      <template slot-scope="scope">
                        <el-button
                          v-if="query.status == 0"
                          size="mini"
                          type="primary"
                          @click="handleRelease(scope.row)"
                        >发布</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </template>
              </el-tab-pane>
              <el-tab-pane label="已发布" name="1">
                <!-- 表格数据 -->
                <el-table :data="tableData2" style="width: 100%" stripe size="small">
                  <el-table-column label="内容ID" prop="contentId" :show-overflow-tooltip="true"></el-table-column>
                  <el-table-column label="内容标题" prop="title" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                      <span
                        style="color:#409EFF;cursor: pointer;"
                        @click="handleViewContent(scope.row)"
                      >{{ scope.row.title }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="栏目名称" prop="channelName" :show-overflow-tooltip="true"></el-table-column>
                  <el-table-column label="申请人" prop="userName" :show-overflow-tooltip="true"></el-table-column>
                  <el-table-column label="申请时间" prop="publishTime" :show-overflow-tooltip="true"></el-table-column>
                  <el-table-column label="发布区域" prop="regionName" :show-overflow-tooltip="true"></el-table-column>
                  <el-table-column label="发布学校" prop="schoolName" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                      <span
                        style="color:#409EFF;cursor:pointer;"
                        @click="handleViewSchool(scope.row)"
                      >查看</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="审核时间" prop="checkTime" :show-overflow-tooltip="true"></el-table-column>
                </el-table>
              </el-tab-pane>
            </el-tabs>
          </el-col>
        </el-row>
      </template>
    </div>
    <div class="page-ft">
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
        <el-dialog width="60%" title="查看上传详情信息" top="40px" :visible.sync="dialogViewContent">
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
      <!-- 待发布学校 -->
      <template>
        <el-dialog top="40px" title="待发布学校查看" :visible.sync="dialogView">
          <el-table :data="schoolData" style="width: 100%" border stripe size="small">
            <el-table-column label="学校名称" :show-overflow-tooltip="true" property="schoolName"></el-table-column>
            <el-table-column label="发布状态" :show-overflow-tooltip="true" property="status">
              <template slot-scope="scope">
                <span v-if="scope.row.status === 0" style="color:#409EFF">待发布</span>
                <span v-else style="color:#67C23A">已发布</span>
              </template>
            </el-table-column>
          </el-table>
        </el-dialog>
      </template>
      <!-- 已发布学校 -->
      <template>
        <el-dialog top="40px" title="已发布学校查看" :visible.sync="dialogViewPublish">
          <el-table :data="schoolDataPublish" style="width: 100%" border stripe size="mini">
            <el-table-column label="学校名称" :show-overflow-tooltip="true" property="schoolName"></el-table-column>
            <el-table-column label="发布状态" :show-overflow-tooltip="true" property="status">
              <template slot-scope="scope">
                <span v-if="scope.row.status === 0" style="color:#909399">初始</span>
                <span v-else-if="scope.row.status === 1" style="color:#409EFF">已更新到栏目</span>
                <span v-else-if="scope.row.status === 2" style="color:#67C23A">已更新到终端</span>
                <span v-else style="color:#F56C6C">更新到终端失败</span>
              </template>
            </el-table-column>
          </el-table>
        </el-dialog>
      </template>
    </div>
  </div>
</template>
<script>
import service from "@/api";
export default {
  name: "release",
  data() {
    return {
      activeName: "first",
      dialogView: false,
      dialogViewPublish: false,
      dialogViewContent: false,
      query: {
        status: 0,
        page: 1,
        pageSize: 100
      },
      info: {},
      tableData: [],
      tableData2: [],
      totalCount: 0,
      schoolData: [],
      schoolDataPublish: []
    };
  },
  methods: {
    handleCurrentChange(curr) {
      this.query.page = curr;
      this.queryPublishContentList(this.query);
    },
    handleSizeChange(size) {
      this.query.pageSize = size;
      this.queryPublishContentList(this.query);
    },
    handleViewContent(row) {
      this.queryContentByContentId(row.contentId);
    },
    handleViewSchool(row) {
      if (this.query.status == 1) {
        this.queryPublishSchoolInfo(row.contentId);
      } else {
        this.queryPrePublishSchoolInfo(row.contentId);
      }
    },
    handleClick(tab) {
      this.query.status = parseInt(tab.name);
      this.query.page = 1;
      this.query.pageSize = 10;
      this.queryPublishContentList(this.query);
    },
    handleRelease(row) {
      this.$confirm(`您确定要发布内容?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.publishContent(row.contentId);
        })
        .catch(error => {
          return false;
        });
    },
    //查询待发布内容列表
    async queryPublishContentList(params = {}) {
      let res = await service.queryPublishContentList(params);
      if (res.errorCode === 0) {
        if (params.status === 0) {
          this.tableData = res.data.data;
        } else {
          this.tableData2 = res.data.data;
        }
        this.totalCount = res.data.totalCount;
      }
    },
    //进行内容正式发布
    async publishContent(contentId) {
      let res = await service.publishContent({ contentId });
      if (res.errorCode === 0) {
        this.$message({ message: `${res.errorMsg}`, type: "success" });
        this.queryPublishContentList(this.query);
      }
    },
    //内容发布（待发布）学校信息
    async queryPrePublishSchoolInfo(contentId) {
      let res = await service.queryPrePublishSchoolInfo({ contentId });
      if (res.errorCode === 0) {
        this.dialogView = true;
        this.schoolData = res.data;
      }
    },
    //内容发布（已发布）学校信息
    async queryPublishSchoolInfo(contentId) {
      let res = await service.queryPublishSchoolInfo({ contentId });
      if (res.errorCode === 0) {
        this.dialogViewPublish = true;
        this.schoolDataPublish = res.data;
      }
    },
    //查询内容
    async queryContentByContentId(contentId) {
      let res = await service.queryContentByContentId({ contentId });
      if (res.errorCode === 0) {
        this.dialogViewContent = true;
        this.info = Object.assign({}, res.data);
      }
    }
  },
  mounted() {
    this.queryPublishContentList(this.query);
  }
};
</script>
<style lang="less">
</style>
