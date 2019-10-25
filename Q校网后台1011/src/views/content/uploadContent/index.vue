<template>
  <div class="page">
    <div class="page-hd"></div>
    <div class="page-bd">
      <div class="newUpload">
        <el-row :gutter="30">
          <el-col :span="12">
            <el-form
              ref="form"
              :model="form"
              status-icon
              label-position="left"
              :label-width="formLabelWidth"
            >
              <el-row :gutter="10">
                <el-col :span="24">
                  <el-form-item
                    label="内容标题"
                    prop="title"
                    :rules="[
                      { required: true, message: '请输入内容标题', trigger:'blur' }
                    ]"
                  >
                    <el-input v-model="form.title" placeholder="请输入内容标题" maxlength="30"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="10">
                <el-col :span="24">
                  <el-form-item
                    label="内容作者"
                    prop="author"
                    :rules="[
                    { required: true, message: '请输入内容作者', trigger: 'blur' }
                    ]"
                  >
                    <el-input v-model="form.author" placeholder="请输入内容作者" maxlength="20"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="内容属性" prop="contentProperty">
                    <el-select v-model="form.contentProperty" style="width: 100%;">
                      <el-option
                        v-for="item in contentPropertyList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="10">
                <template v-if="type !== 1">
                  <el-col :span="24">
                    <el-form-item
                      label="所属栏目"
                      prop="channelId"
                      :rules="[
                        { required: true, message: '请选择所属栏目', trigger: 'blur' }
                      ]"
                    >
                      <el-select v-model="form.channelId" placeholder="请选择" style="width: 100%;">
                        <el-option
                          v-for="item in channelList"
                          :key="item.channelId"
                          :value="item.channelId"
                          :label="item.name"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </template>
              </el-row>
              <el-row :gutter="10">
                <template v-if="type === 1">
                  <el-col :span="24">
                    <el-form-item
                      label="播放时段"
                      prop="channelId"
                      :rules="[
                      { required: true, message: '请选择播放时段', trigger: 'blur' }
                      ]"
                    >
                      <el-select
                        style="width: 100%;"
                        v-model="form.channelId"
                        placeholder="请选择播放时段"
                        value-key="itemId"
                      >
                        <el-option
                          v-for="item in schoolPlayTime"
                          :key="item.itemId"
                          :label="item.time"
                          :value="item.itemId"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </template>
              </el-row>
              <el-form-item label="展示类型">
                <el-row :gutter="10">
                  <el-col :span="5" v-for="(item, index) in filtered_list" :key="index">
                    <div
                      class="showType-item"
                      :class="[ index === screenIndex ? 'selected' : '']"
                      @click="handleScreenSelect(index, item.value)"
                    >
                      <span>{{ item.label }}</span>
                    </div>
                  </el-col>
                </el-row>
              </el-form-item>
              <el-form-item
                label="上传图片"
                prop="images"
                v-if="form.showType == 3 ||form.showType == 4 || form.showType == 5"
              >
                <el-upload
                  list-type="picture-card"
                  class="upImg"
                  name="files"
                  ref="uploadImage"
                  :auto-upload="false"
                  :multiple="true"
                  :with-credentials="true"
                  action="#"
                  accept="image/jpeg, image/gif, image/png, image/bmp"
                  :file-list="imgFileList"
                  :http-request="submitUpload"
                  :on-change="handleChangeUpload"
                  :on-remove="handleRemoveImg"
                  :before-upload="beforeImageUpload"
                >
                  <i class="el-icon-plus"></i>
                  <div
                    class="el-upload__tip"
                    slot="tip"
                    style="color:red;font-size:14px;"
                  >只能上传jpg/png文件，且不超过2M，尺寸大小为(宽：1080px，高：982px).</div>
                </el-upload>
              </el-form-item>
              <el-form-item label="PPT模板下载">
                <el-button type="primary" @click="handleDownPPT(1)">点击下载半屏ppt规格</el-button>
                <el-button type="primary" @click="handleDownPPT(2)">点击下载全屏ppt规格</el-button>
              </el-form-item>
              <el-form-item
                v-if="form.showType == 4 || form.showType == 5"
                label="上传视频"
                prop="videoUrl"
              >
                <el-upload
                  class="avatar-uploader"
                  name="file"
                  :show-file-list="false"
                  ref="uploadVideo"
                  :with-credentials="true"
                  action="/qxiao-cms/action/mod-xiaojiao/channel/content/uploadVideo.do"
                  accept="video/mp4, video/flv, video/mov"
                  :on-success="handleVideoSuccess"
                  :before-upload="beforeVideoUpload"
                  :on-progress="handleVideoProcess"
                >
                  <video
                    v-if="form.videoUrl"
                    :src="form.videoUrl"
                    class="avatar"
                    controls="controls"
                  >您的浏览器不支持视频播放</video>
                  <i
                    v-else-if="form.videoUrl === '' && videoFlag === false"
                    class="el-icon-plus avatar-uploader-icon"
                  ></i>
                  <el-progress
                    v-if="videoFlag"
                    type="circle"
                    :percentage="videoUploadPercent"
                    style="margin-top:12px;"
                  ></el-progress>
                  <div
                    slot="tip"
                    class="el-upload__tip"
                    style="color:red;font-size:14px;"
                  >只能上传MP4/mov/flv视频，且大小不超过100MB.</div>
                </el-upload>
                <el-button
                  v-if="form.videoUrl"
                  size="small"
                  type="primary"
                  @click="handleRemoveVideo"
                >删除视频</el-button>
              </el-form-item>
              <template v-if="type !== 1">
                <el-form-item label="播放时长" prop="durationTime">
                  <el-time-picker
                    :clearable="false"
                    format="mm:ss"
                    value-format="mm:ss"
                    v-model="form.durationTime"
                    placeholder="选择播放时长"
                    style="width:100%"
                  ></el-time-picker>
                </el-form-item>
              </template>
              <el-form-item label="URL地址" prop="webUrl" v-if="form.showType == 6">
                <el-input v-model="form.webUrl" placeholder="请输入URL地址" maxlength="100" disabled></el-input>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="page-ft">
      <!-- 保存按钮 :class="[ collapse ? 'collapse-200' : 'collapse-64' ]" -->
      <div class="page-header">
        <el-button @click="handleViewContent">预览内容</el-button>
        <el-button type="primary" @click="handleUpload('form')">上传内容</el-button>
      </div>
    </div>
    <!--  -->
    <!-- 预览 -->
    <template>
      <el-dialog
        custom-class="qx-dialog"
        width="400px"
        title="预览"
        top="40px"
        :visible.sync="dialogView"
      >
        <div class="image-box" v-if="form.showType == 3">
          <el-carousel ref="carousel" height="589px" :autoplay="false">
            <el-carousel-item v-for="(item, index) in form.images" :key="index">
              <img :src="item.url" class="image" width="400" height="589" :alt="item.name">
            </el-carousel-item>
          </el-carousel>
        </div>
        <template v-if="form.showType === 4">
          <div class="video-box">
            <video :src="form.videoUrl" controls width="400" height="230"></video>
          </div>
        </template>
        <div class="image-box" v-if="form.showType == 4 || form.showType == 5">
          <el-carousel ref="carousel" height="359px" :autoplay="false">
            <el-carousel-item v-for="(item, index) in form.images" :key="index">
              <img :src="item.url" class="image" width="400" height="359" :alt="item.name">
            </el-carousel-item>
          </el-carousel>
        </div>
        <template v-if="form.showType === 5">
          <div class="video-box">
            <video :src="form.videoUrl" controls width="400" height="230"></video>
          </div>
        </template>
      </el-dialog>
    </template>
  </div>
</template>
<script>
import bus from "@/utils/bus";
import service from "@/api";
import { contentProperty, contentTemplate } from "@/mixins";
import { imageUploadValidator } from "@/utils/tools";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "newUpload",
  mixins: [contentProperty, contentTemplate],
  inject: ["reload"], //注入依赖
  data() {
    return {
      dialogView: false,
      formLabelWidth: "100px",
      screenIndex: 0,
      collapse: true,
      videoFlag: false,
      videoUploadPercent: 0,
      uploadForm: "",
      form: {
        title: "",
        channelId: null,
        contentType: 0,
        contentProperty: 0,
        author: "",
        durationTime: "",
        duration: 0, //视频时长
        templateId: 0,
        videoUrl: "",
        md5: "",
        belongTo: 0, // 0-不专属 1-专属对应学校
        images: [],
        playTime: "",
        endTime: "",
        rollContent: "",
        showType: 3,
        webUrl: "/html/index.html"
      },
      channelList: [],
      schoolPlayTime: [],
      imgFileList: []
    };
  },
  computed: {
    //type 账号类型 0-促进会 1-学校 2-教育局 3-培训机构
    ...mapGetters(["type"]),
    filtered_list() {
      if (this.type === 1) {
        return [
          { value: 3, label: "纯图片" },
          { value: 4, label: "上视频下图片" },
          { value: 5, label: "上图片下视频" },
          { value: 6, label: "门户网站" }
        ];
      } else {
        return [
          { value: 3, label: "纯图片" },
          { value: 4, label: "上视频下图片" },
          { value: 5, label: "上图片下视频" }
        ];
      }
    }
  },
  watch: {
    "form.templateId"(value) {
      console.log(value);
    }
  },
  methods: {
    ...mapActions("tabs", ["removes"]),
    removeAction(route) {
      this.removes(route).then(res => {
        if (route.path === this.$route.path) {
          this.$router.push({ path: "/content/upload" });
        }
      });
    },
    handleCancel() {
      this.removeAction(this.$route);
      setTimeout(() => {
        this.reload();
      }, 50);
    },
    //PPT
    handleDownPPT(index) {
      return index === 1
        ? (window.location.href = "./static/半屏ppt规格.pptx")
        : (window.location.href = "./static/全屏ppt规格.pptx");
    },
    //预览内容
    handleViewContent() {
      if (this.form.images.length) {
        this.dialogView = true;
      }
    },
    //计算内容需要播放的时长
    handleDurationTime() {
      //不计算学校的
      if (this.type !== 1 && this.form.showType !== 6) {
        //选择的图片长度
        let imgLen = this.$refs.uploadImage.uploadFiles.length;
        let { duration } = this.form; //视频时长
        let imgDuration = imgLen * 30; //每张图片 * 30s
        let str = "";
        if (imgDuration >= duration) {
          str = this.handleSecondToDate(imgDuration);
        } else if (imgDuration <= duration) {
          str = this.handleSecondToDate(duration);
        }
        this.form.durationTime = str;
      }
    },
    //添加补0操作
    handleFill(i) {
      if (i <= 0 || i <= 9) {
        i = "0" + i;
      }
      return i;
    },
    //秒转换成时分秒
    handleSecondToDate(result) {
      let m = this.handleFill(Math.floor((result / 60) % 60));
      let s = this.handleFill(Math.floor(result % 60));
      return `${m}:${s}`;
    },
    handleChangeUpload(file, fileList) {
      this.handleDurationTime();
    },
    handleRemoveImg() {
      this.handleDurationTime();
    },
    handleRemoveVideo(file) {
      let { videoUrl } = this.form;
      if (videoUrl) {
        let url = videoUrl;
        this.deletePicture(url).then(res => {
          if (res) {
            this.form.videoUrl = "";
            this.form.duration = 0;
            this.handleDurationTime();
          }
        });
      }
    },
    //图片上传大小限制为2M
    beforeImageUpload(file) {
      let isJPG = file.type === "image/jpeg";
      let isGIF = file.type === "image/gif";
      let isPNG = file.type === "image/png";
      let isMBP = file.type === "image/bmp";
      let isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG && !isGIF && !isPNG && !isMBP) {
        this.$message.error("上传图片必须是JPG/GIF/PNG/BMP格式!");
      }
      if (!isLt2M) {
        this.$message.error("图片大小不能超过2MB!");
      }
      return (isJPG || isGIF || isPNG || isMBP) && isLt2M;
    },
    beforeVideoUpload(file) {
      let isMP4 = file.type === "video/mp4";
      let isFLV = file.type === "video/flv";
      let isMOV = file.type === "video/mov";
      let isLt200M = file.size / 1024 / 1024 < 200;

      if (!isMP4 && !isFLV && !isMOV) {
        this.$message.error("视频必须是MP4/FLV/MOV/格式!");
      }

      if (!isLt200M) {
        this.$message.error("视频大小不能超过200MB!");
      }

      return (isMP4 || isFLV || isMOV) && isLt200M;
    },
    //上传进度
    handleVideoProcess(event, file, fileList) {
      this.videoFlag = true;
      this.videoUploadPercent = Math.floor(file.percentage);
    },
    //上传视频成功
    async handleVideoSuccess(response, file, fileList) {
      if (response.errorCode === 0) {
        let { url, duration, md5 } = response.data;
        this.videoFlag = false;
        this.videoUploadPercent = 0;
        this.form.videoUrl = url;
        this.form.duration = duration;
        this.form.md5 = md5;
        this.handleDurationTime();
      }
    },
    handleScreenSelect(index, value) {
      this.screenIndex = index;
      this.form.showType = value;
    },
    async submitAssess() {
      this.uploadForm = new FormData();
      this.$refs.uploadImage.submit();
      let config = {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      };
      let res = await service.filesUpload(this.uploadForm, config);
      if (res.errorCode === 0) {
        this.form.images = res.data;
        return true;
      }
    },
    //图片上传
    submitUpload(file) {
      this.uploadForm.append("files", file.file);
    },
    handleUpload(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          //图片判断
          if (
            this.screenIndex === 0 ||
            this.screenIndex === 1 ||
            this.screenIndex === 2
          ) {
            if (!this.$refs.uploadImage.uploadFiles.length) {
              this.$message({
                message: `请上传图片`,
                type: "warning"
              });
              return false;
            }
          }
          //视频判断
          if (
            !this.form.videoUrl &&
            (this.screenIndex === 1 || this.screenIndex === 2)
          ) {
            this.$message({
              message: `请上传视频`,
              type: "warning"
            });
            return false;
          }
          if (this.form.showType !== 6) {
            let res = await this.submitAssess();
          }
          let schoolPlayTime = this.schoolPlayTime;
          let { belongTo, channelId, ...args } = this.form;
          if (this.type === 1) {
            belongTo = this.type;
            let index = schoolPlayTime.find(elem => elem.itemId === channelId);
            if (index) {
              channelId = index.channelId;
            }
          }
          let obj = Object.assign({}, args, { belongTo, channelId });
          this.uploadContentAction(obj);
        }
      });
    },
    //查询学校门户网站url
    async queryPortalWebUrl() {
      let res = await service.queryPortalWebUrl({});
      if (res.errorCode === 0) {
        this.form.webUrl = res.data;
      }
    },
    //删除图片
    async deletePicture(url) {
      let res = await service.deletePicture({ url });
      if (res.errorCode === 0) {
        return true;
      }
    },
    //查询栏目名称
    async queryChannelAll() {
      let res = await service.queryChannelAll({});
      if (res.errorCode === 0) {
        this.channelList = res.data;
      }
    },
    //查询栏目模板时间段
    async querySchoolPlayListTime(contentType) {
      let res = await service.querySchoolPlayListTime({ contentType });
      if (res.errorCode === 0) {
        this.schoolPlayTime = res.data;
      }
    },
    //上传内容
    async uploadContentAction(params = {}) {
      let res = await service.uploadContent(params, {
        headers: { "Content-Type": "application/json" }
      });
      if (res.errorCode === 0) {
        this.$alert("内容上传成功", "提示", {
          confirmButtonText: "确定",
          showClose: false,
          type: "success"
        })
          .then(() => {
            this.removeAction(this.$route);
            setTimeout(() => {
              this.reload();
            }, 50);
          })
          .catch(error => {
            return false;
          });
      } else if (res.errorCode === -1) {
        this.$message({ message: `${res.errorMsg}`, type: "warning" });
      }
    }
  },
  mounted() {
    bus.$on("collapse", msg => {
      return msg ? (this.collapse = false) : (this.collapse = true);
    });
    if (this.type == 1) {
      this.querySchoolPlayListTime(0);
      this.queryPortalWebUrl();
    } else {
      this.queryChannelAll();
    }
  }
};
</script>
<style lang="less" scoped>
.newUpload {
  padding: 20px 20px 50px 20px;
  // min-height: 600px;
  // margin-bottom: 100px;
  background-color: #fff;
}
.collapse-200 {
  left: 200px;
  width: calc(100% - 200px);
}
.collapse-64 {
  left: 64px;
  width: calc(100% - 64px);
}
.page-header {
  // position: fixed;
  // bottom: 0;
  // z-index: 10;
  border-top: 1px solid #ebeef5;
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  transition: left 0.6s, width 0.6s;
  box-shadow: 0 1px 15px 0 rgba(0, 0, 0, 0.12);
}
.showType-item {
  //margin: 20px 0;
  color: #909399;
  cursor: pointer;
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f4f4f5;
  &.selected {
    border: 2px dashed #409eff;
  }
  .image {
    width: 100%;
  }
}
</style>
