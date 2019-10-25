<template>
  <div class="page">
    <div class="page-hd"></div>
    <div class="page-bd">
      <template>
        <el-row :gutter="10">
          <el-col :span="24">
            <el-tabs ref="tabs" class="qx-page-tabs" type="border-card" @tab-click="handleTabClick">
              <el-tab-pane label="内容播放" name="0">
                <div class="page-form">
                  <el-form
                    :inline="true"
                    :model="query"
                    size="small"
                    label-width="70px"
                    label-position="left"
                  >
                    <el-form-item label="内容标题">
                      <el-input v-model="query.title" placeholder="请输入内容标题" maxlength="40"></el-input>
                    </el-form-item>
                    <el-form-item label="栏目名称">
                      <el-select v-model="query.channelId" placeholder="请选择">
                        <el-option
                          v-for="item in channelList"
                          :key="item.channelId"
                          :value="item.channelId"
                          :label="item.name"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="审核状态">
                      <el-select v-model="query.verifyStatus" clearable placeholder="请选择设备状态">
                        <el-option
                          v-for="item in verifyStatusList"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item>
                      <el-button icon="el-icon-search" type="primary" @click="handleSearch">查询</el-button>
                      <el-button icon="el-icon-plus" type="primary" @click="uoloadAction">上传内容</el-button>
                    </el-form-item>
                  </el-form>
                </div>
                <el-table :data="tableData" style="width: 100%" size="small">
                  <el-table-column
                    :resizable="false"
                    label="内容ID"
                    prop="contentId"
                    :show-overflow-tooltip="true"
                  ></el-table-column>
                  <el-table-column
                    :resizable="false"
                    label="内容标题"
                    prop="title"
                    :show-overflow-tooltip="true"
                  >
                    <template slot-scope="scope">
                      <span
                        style="color:#409EFF;cursor:pointer;"
                        @click="handleViewInfo(scope.row)"
                      >{{ scope.row.title }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    :resizable="false"
                    label="栏目名称"
                    prop="channelName"
                    :show-overflow-tooltip="true"
                  >
                    <template slot-scope="scope">
                      <p v-if="scope.row.channelName == null">无</p>
                      <p v-else>{{ scope.row.channelName }}</p>
                    </template>
                  </el-table-column>
                  <el-table-column
                    :resizable="false"
                    label="内容属性"
                    prop="contentProperty"
                    :show-overflow-tooltip="true"
                  >
                    <template slot-scope="scope">
                      <p v-if="scope.row.contentProperty === 0">原创</p>
                      <p v-else>摘要</p>
                    </template>
                  </el-table-column>
                  <el-table-column
                    :resizable="false"
                    label="作者"
                    prop="author"
                    :show-overflow-tooltip="true"
                  ></el-table-column>
                  <el-table-column
                    :resizable="false"
                    label="审核节点"
                    prop="verifyStatus"
                    :show-overflow-tooltip="true"
                  >
                    <template slot-scope="scope">
                      <span
                        v-if="scope.row.verifyStatus === 0 && scope.row.checkStage === 1"
                        style="color:#409EFF"
                      >初审中</span>
                      <span
                        v-else-if="scope.row.verifyStatus === 1 && scope.row.checkStage === 1"
                        style="color:#409EFF"
                      >复审中</span>
                      <span
                        v-else-if="scope.row.verifyStatus === 1 && scope.row.checkStage === 2"
                        style="color:#409EFF"
                      >终审中</span>
                      <span
                        v-else-if="scope.row.verifyStatus === 1 && scope.row.checkStage === 3"
                        style="color:#67C23A;"
                      >审核通过</span>
                      <span
                        v-else
                        style="color:#F56C6C;cursor: pointer;"
                        @click="handleCheckNode(scope.row)"
                      >审核不通过</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    :resizable="false"
                    label="时间"
                    prop="postTime"
                    :show-overflow-tooltip="true"
                  ></el-table-column>
                  <el-table-column label="操作">
                    <template slot-scope="scope">
                      <router-link
                        style="color:#409EFF"
                        :to="{path: `/content/uploadContentEdit/${scope.row.contentId}`}"
                        v-if="scope.row.verifyStatus === 2"
                      >编辑</router-link>
                      <el-button size="mini" type="text" @click="handleDel(scope.row)">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
              <el-tab-pane label="滚动通知" name="1">
                <div class="page-form">
                  <el-form
                    :inline="true"
                    :model="querys"
                    size="small"
                    label-width="70px"
                    label-position="left"
                  >
                    <el-form-item label="内容标题">
                      <el-input v-model="querys.title" placeholder="请输入内容标题" maxlength="40"></el-input>
                    </el-form-item>
                    <el-form-item label="审核状态">
                      <el-select v-model="querys.verifyStatus" clearable placeholder="请选择设备状态">
                        <el-option
                          v-for="item in verifyStatusList"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item>
                      <el-button icon="el-icon-search" type="primary" @click="handleSearch">查询</el-button>
                      <el-button icon="el-icon-plus" type="primary" @click="handleAdd">上传滚动通知</el-button>
                    </el-form-item>
                  </el-form>
                </div>
                <el-table :data="tableData2" style="width: 100%" size="small">
                  <el-table-column
                    :resizable="false"
                    label="标题"
                    prop="title"
                    :show-overflow-tooltip="true"
                  ></el-table-column>
                  <el-table-column
                    :resizable="false"
                    label="通知内容"
                    prop="rollContent"
                    :show-overflow-tooltip="true"
                  ></el-table-column>
                  <el-table-column :resizable="false" label="播放有效期" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                      <p>{{ scope.row.playTime }} 至 {{ scope.row.endTime }}</p>
                    </template>
                  </el-table-column>
                  <el-table-column
                    :resizable="false"
                    label="审核节点"
                    prop="verifyStatus"
                    :show-overflow-tooltip="true"
                  >
                    <template slot-scope="scope">
                      <span
                        v-if="scope.row.verifyStatus === 0 && scope.row.checkStage === 1"
                        style="color:#409EFF"
                      >初审中</span>
                      <span
                        v-else-if="scope.row.verifyStatus === 1 && scope.row.checkStage === 1"
                        style="color:#409EFF"
                      >复审中</span>
                      <span
                        v-else-if="scope.row.verifyStatus === 1 && scope.row.checkStage === 2"
                        style="color:#409EFF"
                      >终审中</span>
                      <span
                        v-else-if="scope.row.verifyStatus === 1 && scope.row.checkStage === 3"
                        style="color:#67C23A;"
                      >审核通过</span>
                      <span
                        v-else
                        style="color:#F56C6C;cursor: pointer;"
                        @click="handleCheckNode(scope.row)"
                      >审核不通过</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    :resizable="false"
                    label="上传时间"
                    prop="postTime"
                    :show-overflow-tooltip="true"
                  ></el-table-column>
                  <el-table-column width="200" label="操作">
                    <template slot-scope="scope">
                      <el-button
                        size="mini"
                        type="text"
                        @click="handleEdit(scope.row)"
                        v-if="scope.row.verifyStatus === 2"
                      >编辑</el-button>
                      <el-button size="mini" type="text" @click="handleDel(scope.row)">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
            </el-tabs>
          </el-col>
        </el-row>
      </template>
      <!-- 上传列表 -->
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

    <!-- 滚动文字上传 -->
    <el-dialog top="40px" title="滚动文字上传" :visible.sync="dialogText">
      <el-form
        ref="form"
        :model="form"
        size="small"
        :label-width="formLabelWidth"
        label-position="left"
      >
        <el-form-item
          label="内容标题"
          prop="title"
          :rules="[
          { required: true, message: '请输入内容标题', trigger:'blur' }
        ]"
        >
          <el-input v-model="form.title" placeholder="请输入内容标题" maxlength="30"></el-input>
        </el-form-item>
        <el-form-item
          label="开始日期"
          prop="playTime"
          :rules="[
          { required: true, message: '请选择开始日期', trigger: 'blur' }
        ]"
        >
          <el-date-picker
            value-format="yyyy-MM-dd"
            v-model="form.playTime"
            type="date"
            :picker-options="pickerOptions"
            placeholder="播放开始日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item
          label="结束日期"
          prop="endTime"
          :rules="[
          { required: true, message: '请选择结束日期', trigger: 'blur' }
        ]"
        >
          <el-date-picker
            value-format="yyyy-MM-dd"
            v-model="form.endTime"
            type="date"
            :picker-options="pickerOptions"
            placeholder="播放开始日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item
          label="文字内容"
          prop="rollContent"
          :rules="[
          { required: true, message: '请输入文字内容', trigger: 'blur' }
        ]"
        >
          <el-input type="textarea" v-model="form.rollContent" :rows="8" placeholder="请输入文字内容"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogText = false">取消</el-button>
        <el-button size="small" type="primary" @click="formSubmit('form')">确定</el-button>
      </span>
    </el-dialog>
    <!-- 查看上传详情信息 -->
    <template>
      <el-dialog width="60%" title=" 查看上传详情信息" top="40px" :visible.sync="dialogView">
        <el-row :gutter="10" type="flex" class="row-bg">
          <div class="one">
            <div class="image-box" v-if="info.showType == 3">
              <el-carousel ref="carousel" height="589px" :autoplay="false">
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
              <el-carousel ref="carousel" height="359px" :autoplay="false">
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
    <!-- 查看审核节点 -->
    <template>
      <el-dialog width="60%" top="40px" title="审核节点" :visible.sync="dialogNode">
        <el-table :data="nodeData" style="width: 100%" border stripe size="mini">
          <el-table-column width="150" type="index" label="申请编号" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column
            width="150"
            property="checkStage"
            label="审核环节"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.checkStage === 0">待审核</span>
              <span v-else-if="scope.row.checkStage === 1">初审</span>
              <span v-else-if="scope.row.checkStage === 2">复审</span>
              <span v-else>终审</span>
            </template>
          </el-table-column>
          <el-table-column
            width="150"
            property="verifyStatus"
            label="审核结果"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              <span style="color:#409EFF" v-if="scope.row.verifyStatus === 0">初始</span>
              <span style="color:#67C23A;" v-else-if="scope.row.verifyStatus === 1">审核通过</span>
              <span style="color:#F56C6C;" v-else>审核不通过</span>
            </template>
          </el-table-column>
          <el-table-column
            width="150"
            property="postTime"
            label="审核时间"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column property="verifyDescription" label="审核意见" :show-overflow-tooltip="true"></el-table-column>
        </el-table>
      </el-dialog>
    </template>
  </div>
</template>
<script>
import service from "@/api";
import { disabledDate } from "@/utils/tools";
export default {
  name: "upload",
  data() {
    return {
      dialogNode: false,
      dialogView: false,
      dialogText: false,
      formLabelWidth: "100px",
      form: {
        title: "",
        contentType: 1,
        playTime: "",
        endTime: "",
        //rollTime: [],
        rollContent: ""
      },
      pickerOptions: {
        disabledDate
      },
      query: {
        channelId: 0,
        verifyStatus: 3,
        title: "",
        page: 1,
        pageSize: 20
      },
      querys: {
        verifyStatus: 3,
        title: "",
        page: 1,
        pageSize: 20
      },
      info: {},
      verifyStatusList: [
        { value: 0, label: "审核中" },
        { value: 1, label: "审核通过" },
        { value: 2, label: "审核不通过 " },
        { value: 3, label: "全部" }
      ],
      tableData: [],
      tableData2: [],
      totalCount: 0,
      nodeData: [],
      channelList: []
    };
  },
  methods: {
    handleCurrentChange(curr) {
      this.query.page = curr;
      this.queryContentList();
    },
    handleSizeChange(size) {
      this.query.pageSize = size;
      this.queryContentList();
    },
    handleSearch() {
      let currentName = this.$refs.tabs.currentName;
      if (currentName == 0) {
        this.queryContentList();
      } else {
        this.queryRollContent();
      }
    },
    handleAdd() {
      this.dialogText = true;
      this.form = {
        contentType: 1
      };
    },
    handleEdit(row) {
      let { checkStage, postTime, verifyStatus, ...args } = row;
      this.dialogText = true;
      this.form = Object.assign({}, args);
    },
    handleTabClick(tab) {
      if (tab.name == 0) {
        this.queryContentList();
      } else {
        this.queryRollContent();
      }
    },
    handleViewInfo(row) {
      this.queryContentByContentId(row.contentId);
    },
    handleCheckNode(row) {
      let { contentId, verifyStatus } = row;
      if (contentId && verifyStatus === 2) {
        this.dialogNode = true;
        this.queryCheckNode(contentId);
      }
    },
    handleDel(row) {
      let that = this;
      this.$confirm(`确定删除吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          that.deleteContent(row.contentId);
        })
        .catch(error => {
          return false;
        });
    },
    uoloadAction() {
      this.$router.push({ path: "/content/uploadContent" });
    },
    formSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let { contentId, ...args } = this.form;
          if (contentId) {
            let obj = Object.assign({}, args, { contentId });
            this.updateRollContent(obj);
          } else {
            let objs = Object.assign({}, args);
            this.uploadContent(objs);
          }
        }
      });
    },
    //查询栏目名称
    async queryChannelAll() {
      let res = await service.queryChannelAll({});
      if (res.errorCode === 0) {
        this.channelList = res.data;
        this.channelList.unshift({ channelId: 0, name: "全部" });
      }
    },
    //查询上传列表审核节点
    async queryCheckNode(contentId) {
      let res = await service.queryCheckNode({ contentId });
      if (res.errorCode === 0) {
        this.nodeData = res.data;
      }
    },
    //查询我的上传列表
    async queryContentList() {
      let res = await service.queryContentList(this.query);
      if (res.errorCode === 0) {
        this.tableData = res.data.data;
      }
    },
    //查询滚动通知列表
    async queryRollContent() {
      let res = await service.queryRollContent(this.querys);
      if (res.errorCode === 0) {
        this.tableData2 = res.data.data;
      }
    },
    //删除上传内容
    async deleteContent(contentId) {
      let res = await service.deleteContent({ contentId });
      if (res.errorCode === 0) {
        let currentName = this.$refs.tabs.currentName;
        this.$message({ message: `${res.errorMsg}`, type: "success" });
        if (currentName == 0) {
          this.queryContentList();
        } else {
          this.queryRollContent();
        }
      } else if (res.errorCode === -1) {
        this.$message({ message: `${res.errorMsg}`, type: "error" });
      }
    },
    //查询编辑内容
    async queryContentByContentId(contentId) {
      let res = await service.queryContentByContentId({ contentId });
      if (res.errorCode === 0) {
        this.info = Object.assign({}, res.data);
        this.dialogView = true;
      }
    },
    //上传内容
    async uploadContent(params = {}) {
      let res = await service.uploadContent(params, {
        headers: { "Content-Type": "application/json" }
      });
      if (res.errorCode === 0) {
        this.dialogText = false;
        this.$refs.form.resetFields();
        this.queryRollContent();
        this.$message({ message: `${res.errorMsg}`, type: "success" });
      }
    },
    async updateRollContent(params = {}) {
      let res = await service.updateRollContent(params, {
        headers: { "Content-Type": "application/json" }
      });
      if (res.errorCode === 0) {
        this.dialogText = false;
        this.queryRollContent();
        this.$refs.form.resetFields();
        this.$message({ message: `滚动文字编辑成功`, type: "success" });
      }
    }
  },
  activated() {
    this.queryContentList();
    this.queryChannelAll();
  }
};
</script>
<style lang="less" scoped>
</style>
