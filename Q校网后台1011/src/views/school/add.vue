<template>
  <div class="page">
    <div class="page-hd"></div>
    <div class="page-bd">
      <div class="newSchool">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="24" :md="20" :lg="18" :xl="18">
            <el-form
              :rules="rules"
              ref="form"
              :model="form"
              status-icon
              :label-width="formLabelWidth"
            >
              <el-row :gutter="5">
                <el-col :span="8">
                  <el-form-item label="区域选择" prop="regionId">
                    <qx-region @last="lastInnerChange" v-model="form.regionId"></qx-region>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="详细地址" prop="address">
                    <el-input v-model="form.address" placeholder="请输入详细地址"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="5">
                <el-col :span="8">
                  <el-form-item label="学校名称" prop="name">
                    <el-input v-model="form.name" placeholder="请输入学校名称"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="学校性质" prop="propertyId">
                    <el-select v-model="form.propertyId" placeholder="请选择学校性质" style="width:100%">
                      <el-option
                        v-for="item in propertyidList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="学校类型" prop="typeId">
                    <el-select v-model="form.typeId" placeholder="请选择学校类型" style="width:100%">
                      <el-option
                        v-for="item in typeidList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="办学元年" prop="firstYear">
                    <el-date-picker
                      format="yyyy"
                      value-format="yyyy"
                      v-model="form.firstYear"
                      type="year"
                      placeholder="选择办学元年"
                      style="width:100%"
                    ></el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="学校标语" prop="slogan">
                    <el-input v-model="form.slogan" placeholder="请输入学校标语"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="学校标签" prop="labelIds">
                    <el-select
                      v-model="form.labelIds"
                      value-key="labelId"
                      multiple
                      collapse-tags
                      placeholder="请选择学校标签"
                      style="width:100%"
                    >
                      <el-option
                        v-for="item in labelsList"
                        :key="item.labelId"
                        :label="item.name"
                        :value="item.labelId"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="班级数量" prop="classNumber">
                    <el-input v-model="form.classNumber" placeholder="请输入班级数量"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="学生数量" prop="studentNumber">
                    <el-input v-model="form.studentNumber" placeholder="请输入学生数量"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="5">
                <el-col :span="8">
                  <el-form-item label="校长" prop="masterName">
                    <el-input v-model="form.masterName" placeholder="请输入校长" maxlength="4"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="校长电话" prop="masterPhone">
                    <el-input v-model="form.masterPhone" placeholder="请输入校长电话"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="校长邮箱" prop="masterEmail">
                    <el-input v-model="form.masterEmail" placeholder="请输入校长邮箱"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="5">
                <el-col :span="8">
                  <el-form-item label="负责人" prop="headName">
                    <el-input v-model="form.headName" placeholder="请输入负责人" maxlength="4"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="负责人电话" prop="headPhone">
                    <el-input v-model="form.headPhone" placeholder="请输入负责人电话"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="负责人邮箱" prop="headEmail">
                    <el-input v-model="form.headEmail" placeholder="请输入负责人邮箱"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <!-- for -->
              <el-row v-for="(item,index) in form.linkMan" :key="index">
                <el-col :span="8">
                  <el-form-item :label="`联系人`" :prop="`linkMan`" :rules="linkmanRules.linkman">
                    <el-input v-model="item.linkMan" placeholder="请输入联系人" maxlength="4"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="`联系人电话`" :prop="`linkMan`" :rules="linkmanRules.phone">
                    <el-input v-model="item.phone" placeholder="请输入联系人电话"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="`联系人邮箱`" :prop="`linkMan`" :rules="linkmanRules.email">
                    <el-input v-model="item.email" placeholder="请输入联系人邮箱"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <!-- for -->
              <el-form-item>
                <el-button
                  icon="el-icon-plus"
                  size="mini"
                  type="primary"
                  @click="handleAddlinkMan"
                >新增联系人</el-button>
              </el-form-item>
              <el-form-item label="学校简介" prop="description">
                <el-input
                  type="textarea"
                  v-model="form.description"
                  placeholder="请输入学校简介"
                  :rows="4"
                ></el-input>
              </el-form-item>
              <el-form-item label="栏目模板">
                <el-select v-model="form.channelTemplateId" placeholder="请选择栏目播放模板">
                  <el-option
                    v-for="item in templateidList"
                    :key="item.templateId"
                    :label="item.name"
                    :value="item.templateId"
                  ></el-option>
                </el-select>
                <a
                  href="javascript:;"
                  style="color:#409EFF;margin-left:10px;"
                  @click="handlePreviewChannelTemplate"
                >栏目模板预览</a>
              </el-form-item>
              <el-form-item label="内容复审">
                <el-radio-group v-model="form.reviewFlag">
                  <el-radio :label="1">需要</el-radio>
                  <el-radio :label="0">不需要</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-row :gutter="5">
                <el-col :span="12" :offset="2">
                  <el-upload
                    ref="upload"
                    action="/qxiao-cms/action/mod-xiaojiao/region/addImage.do"
                    name="honorImage"
                    :data="{type: '0'}"
                    :multiple="false"
                    accept="image/jpeg, image/gif, image/png, image/bmp"
                    :auto-upload="true"
                    :show-file-list="false"
                    :on-success="handleImageOneSuccess"
                    :before-upload="beforeImageUpload"
                  >
                    <el-button size="small" type="primary">学校荣誉图片上传</el-button>
                  </el-upload>
                  <div class="upload-image" :style="{backgroundImage: imgOneUrl}"></div>
                  <span
                    style="color:#F56C6C;cursor: pointer;"
                    class="delete"
                    v-if="imgOneUrl"
                    @click="handleDeleteImg(0)"
                  >删除</span>
                </el-col>
                <el-col :span="10">
                  <el-upload
                    ref="upload"
                    action="/qxiao-cms/action/mod-xiaojiao/region/addImage.do"
                    name="honorImage"
                    :data="{type: '1'}"
                    :multiple="false"
                    accept="image/jpeg, image/gif, image/png, image/bmp"
                    :auto-upload="true"
                    :show-file-list="false"
                    :on-success="handleImageOneSuccess"
                    :before-upload="beforeImageUpload"
                  >
                    <el-button size="small" type="primary">学校全景图上传</el-button>
                  </el-upload>
                  <div class="upload-image" :style="{backgroundImage: imgTwoUrl}"></div>
                  <span
                    style="color:#F56C6C;cursor: pointer;"
                    class="delete"
                    v-if="imgTwoUrl"
                    @click="handleDeleteImg(1)"
                  >删除</span>
                </el-col>
              </el-row>
            </el-form>
          </el-col>
        </el-row>
        <!-- 栏目模板预览 -->
        <template>
          <el-dialog center width="60%" :visible.sync="previewChannel">
            <el-table :data="channelData" style="width: 100%" stripe size="mini">
              <el-table-column
                :resizable="false"
                label="栏目名称"
                prop="channelName"
                :show-overflow-tooltip="true"
              ></el-table-column>
              <el-table-column
                :resizable="false"
                label="栏目播放时间"
                prop="playTime"
                :show-overflow-tooltip="true"
              ></el-table-column>
              <el-table-column
                :resizable="false"
                label="播放优先级"
                prop="priority"
                :show-overflow-tooltip="true"
              ></el-table-column>
              <el-table-column
                :resizable="false"
                label="有效期"
                prop="validTime"
                :show-overflow-tooltip="true"
              ></el-table-column>
            </el-table>
          </el-dialog>
        </template>
        <!-- 图片查看 -->
      </div>
    </div>
    <div class="page-ft">
      <!-- 保存按钮 :class="[ collapse ? 'collapse-200' : 'collapse-64' ]" -->
      <div class="page-header">
        <el-button type="primary" @click="formSubmit('form')">添加学校</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import service from "@/api";
import region from "@/components/region";
import { isPhone } from "@/utils/validator";
import { property, typeid } from "@/mixins";
import { mapActions } from "vuex";
export default {
  name: "schoolAdd",
  components: {
    "qx-region": region
  },
  mixins: [property, typeid],
  inject: ["reload"], //注入依赖
  data() {
    return {
      dialogViewImg: false,
      previewChannel: false,
      formLabelWidth: "100px",
      imgOneUrl: "",
      imgTwoUrl: "",
      labelsList: [],
      templateidList: [],
      channelData: [],
      imgOne: [],
      imgTwo: [],
      form: {
        channelTemplateId: null,
        regionId: [],
        address: "",
        name: "",
        firstYear: "",
        slogan: "",
        classNumber: "",
        studentNumber: "",
        reviewFlag: 0,
        masterName: "",
        masterEmail: "",
        masterPhone: "",
        headName: "",
        headEmail: "",
        headPhone: "",
        description: "",
        linkMan: []
      },
      linkmanRules: {},
      rules: {
        regionId: [{ required: true, message: "请选择区域", trigger: "blur" }],
        name: [{ required: true, message: "请输入学校名称", trigger: "blur" }],
        propertyId: [
          { required: true, message: "请选择学校性质", trigger: "blur" }
        ],
        typeId: [
          { required: true, message: "请选择学校类型", trigger: "blur" }
        ],
        address: [
          { required: true, message: "请输入详细地址", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    ...mapActions("tabs", ["removes"]),
    removeAction(route) {
      this.removes(route).then(res => {
        if (route.path === this.$route.path) {
          this.$router.push({ path: "/school/list" });
        }
      });
    },
    //添加联系人
    handleAddlinkMan() {
      let linkMan = this.form.linkMan;
      linkMan.push({ linkMan: "", phone: "", email: "" });
    },
    //删除图片
    handleDeleteImg(n) {
      let result = n === 0 ? this.imgOne[0] : this.imgTwo[0];
      if (Object.keys(result).length) {
        let { url, smallUrl } = result;
        this.deleteSchoolPicture(url, smallUrl).then(res => {
          if (res) {
            if (n === 0) {
              this.imgOneUrl = "";
              this.imgOne = [];
            } else {
              this.imgTwoUrl = "";
              this.imgTwo = [];
            }
          }
        });
      }
    },
    //图片上传成功
    handleImageOneSuccess(response, file, fileList) {
      let schoolImage = this.form.schoolImage;
      if (response.errorCode === 0) {
        let imgObj = {
          url: response.data.url,
          smallUrl: response.data.smallUrl,
          type: response.data.type
        };
        if (response.data.type == 0) {
          this.imgOneUrl = `url(${response.data.url})`;
          this.imgOne[0] = imgObj;
        } else {
          this.imgTwoUrl = `url(${response.data.url})`;
          this.imgTwo[0] = imgObj;
        }
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
    lastInnerChange(value) {
      this.form.regionId = value;
    },
    formSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let schoolImage = this.imgOne.concat(this.imgTwo);
          let { regionId: regionIds, ...args } = this.form;
          let regionId = regionIds[regionIds.length - 1] || 0;
          let obj = Object.assign({}, args, { regionId, schoolImage });
          console.log(obj);
          this.addSchool(obj);
        }
      });
    },
    //删除图片
    async deleteSchoolPicture(url, smallUrl) {
      let res = await service.deleteSchoolPicture({ url, smallUrl });
      if (res.errorCode === 0) {
        return true;
      } else {
        return false;
      }
    },
    //查询栏目模板
    async queryChannelTemplateAll() {
      let res = await service.queryChannelTemplateAll({});
      if (res.errorCode === 0) {
        this.templateidList = res.data;
        //设置默认栏目模板
        let d = this.templateidList.find(item => item.type === 1);
        this.form.channelTemplateId = d.templateId;
      }
    },
    //栏目模板详细预览
    async handlePreviewChannelTemplate() {
      let templateId = this.form.channelTemplateId;
      let res = await service.previewChannelTemplateDetail({ templateId });
      if (res.errorCode === 0) {
        this.previewChannel = true;
        this.channelData = res.data;
      }
    },
    //查询标签
    async queryLabel() {
      let res = await service.queryLabel({ queryType: 1 });
      if (res.errorCode === 0) {
        this.labelsList = res.data;
      }
    },
    //新增学校
    async addSchool(params = {}) {
      let res = await service.addSchool(params, {
        headers: { "Content-Type": "application/json" }
      });
      if (res.errorCode === 0) {
        this.$alert("新增学校成功", "提示", {
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
      }
    }
  },
  activated() {
    this.queryLabel();
    this.queryChannelTemplateAll();
  }
};
</script>
<style lang="less" scoped>
.newSchool {
  padding: 20px 20px 50px 20px;
  background-color: #fff;
}
.img {
  width: 100%;
  height: 100%;
  background-size: cover;
}
.views-image {
  text-align: center;
}
.page-header {
  border-top: 1px solid #ebeef5;
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  transition: left 0.6s, width 0.6s;
  box-shadow: 0 1px 15px 0 rgba(0, 0, 0, 0.12);
}
</style>
