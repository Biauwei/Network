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
                v-for="item in checkStageList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button size="small" icon="el-icon-search" type="primary" @click="handleSearch">查询</el-button>
            <el-button
              size="small"
              icon="el-icon-plus"
              type="primary"
              @click="dialogFormVisible = true"
            >上传作品</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="page-bd">
      <!-- 表格数据 -->
      <el-table :data="tableData" style="width: 100%" size="small">
        <el-table-column label="作品集ID" prop="collectionId" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="内容标题" prop="title" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="作品类型" prop="type" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span size="mini" v-if="scope.row.type === 1">学生作品</span>
            <span size="mini" v-else-if="scope.row.type === 2">班级风采</span>
            <span size="mini" v-else>精选优品</span>
          </template>
        </el-table-column>
        <el-table-column label="上传类型" prop="uploadType" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span size="mini" v-if="scope.row.uploadType">压缩包</span>
            <span size="mini" v-else>图片</span>
          </template>
        </el-table-column>
        <el-table-column label="压缩包处理阶段" prop="processStage" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <template v-if="scope.row.uploadType">
              <span v-if="scope.row.processStage === 1">解压完成</span>
              <span v-else>文件解压中</span>
            </template>
          </template>
        </el-table-column>
        <el-table-column label="审核状态" prop="checkStage" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span size="mini" v-if="scope.row.checkStage === 0">待审核</span>
            <span size="mini" v-else>审核完成</span>
          </template>
        </el-table-column>
        <el-table-column label="审核时间" prop="checkTime" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="上传时间" prop="postTime" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              :disabled="scope.row.processStage === 0"
              size="mini"
              type="primary"
              @click="handleWorksInfo(scope.row.collectionId, scope.$index)"
            >查看</el-button>
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
    <!-- 新增 -->
    <el-dialog
      width="60%"
      top="40px"
      title="上传作品"
      :close-on-click-modal="false"
      :show-close="false"
      :visible.sync="dialogFormVisible"
    >
      <el-form ref="form" :model="form" status-icon size="small" :label-width="formLabelWidth">
        <el-form-item
          label="作品标题"
          prop="title"
          :rules="[
            { required: true, message: '请输入作品标题', trigger: 'blur' }
          ]"
        >
          <el-input v-model="form.title" placeholder="请输入作品标题"></el-input>
        </el-form-item>
        <el-form-item label="作品类别">
          <el-select v-model="form.type" placeholder="选择作品类别">
            <el-option
              v-for="item in worksTypeList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上传类型">
          <el-select v-model="form.uploadType" placeholder="选择上传类型">
            <el-option
              v-for="item in uploadType"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <template v-if="form.uploadType">
          <el-form-item label="压缩包上传">
            <el-upload
              name="files"
              ref="uploadImage"
              :auto-upload="false"
              :multiple="true"
              :with-credentials="true"
              :limit="1"
              action="#"
              accept=".rar, .zip"
              :http-request="submitCompressUpload"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传rar或zip后缀的压缩文件，文件大小不能超过100M</div>
            </el-upload>
          </el-form-item>
        </template>
        <template v-else>
          <el-form-item label="图片上传">
            <el-upload
              list-type="picture-card"
              name="files"
              ref="uploadImage"
              :auto-upload="false"
              :multiple="true"
              :with-credentials="true"
              :limit="10"
              action="#"
              accept="image/jpeg, image/png"
              :on-exceed="handleExceed"
              :http-request="submitUpload"
            >
              <i class="el-icon-plus"></i>
              <div slot="tip" class="el-upload__tip">每次只能上传10张，每张图片不能超过5M，超出请选择压缩包上传</div>
            </el-upload>
          </el-form-item>
        </template>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogFormVisible = false">取消</el-button>
        <el-button
          size="small"
          type="primary"
          :loading="btnLoading"
          @click="submitForm('form')"
        >{{ btnLoading ? '上传中':'确定' }}</el-button>
      </span>
    </el-dialog>
    <!-- 作品集详情 -->
    <el-dialog width="80%" top="20px" title="作品列表" :visible.sync="dialogWorks">
      <el-dialog
        custom-class="qx-dialog"
        append-to-body
        title="作品集查看"
        :visible.sync="dialogWorksInner"
        @open="handleOpen"
      >
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
      <div class="table-tools">
        <el-button type="primary" size="mini" @click="handleBatchRecommend">批量推荐</el-button>
      </div>
      <el-table
        ref="singleTable"
        :data="worksData"
        style="width: 100%"
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
        <el-table-column prop="verifyDescrition" label="审核意见" :show-overflow-tooltip="true"></el-table-column>
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
            <el-button size="mini" type="danger" @click="handleDelWorks(scope.row)">删除</el-button>
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
import { checkStage, worksType } from "@/mixins";
import pageMixins from "@/mixins/page";
export default {
  name: "worksList",
  mixins: [checkStage, worksType, pageMixins],
  data() {
    return {
      carouselIndex: 0,
      btnLoading: false,
      rowIndex: null,
      dialogFormVisible: false,
      dialogWorks: false,
      dialogWorksInner: false,
      query: {
        type: 0,
        checkStage: 9,
        title: ""
      },
      querys: {
        collectionId: null,
        page: 1,
        pageSize: 8
      },
      uploadType: [
        { id: 0, name: "多图片上传" },
        { id: 1, name: "压缩包上传" }
      ],
      form: {
        title: "",
        type: 1,
        uploadType: 0,
        images: [],
        compressFile: ""
      },
      worksCount: 0,
      uploadForm: "",
      worksData: [],
      multipleSelection: []
    };
  },
  methods: {
    handleCurrentChange(curr) {
      this.query.page = curr;
      this.querySchoolCollection(this.query);
    },
    handleSizeChange(size) {
      this.query.pageSize = size;
      this.querySchoolCollection(this.query);
    },
    handleSearch() {
      this.querySchoolCollection(this.query);
    },
    //作品集详情查询
    handleWorksInfo(collectionId, index) {
      if (this.rowIndex === index) {
      } else {
        this.rowIndex = index;
        this.querys.page = 1;
      }
      this.querys.collectionId = collectionId;
      this.queryWorksDetailList(this.querys);
    },
    worksCurrentChange(curr) {
      this.querys.page = curr;
      this.queryWorksDetailList(this.querys);
    },
    handleChangeSwitch(row) {
      let { worksId, recommend } = row;
      this.recommendWorks({ recommend, worksIds: [worksId] });
    },
    //只有未推荐和审核通过的才不能选择
    handleSelectCheckbox(row, index) {
      return row.recommend === 0 && row.verifyStatus === 1 ? true : false;
    },
    handleViewsImg(index) {
      this.dialogWorksInner = true;
      this.carouselIndex = index;
    },
    handleOpen() {
      setTimeout(() => {
        this.$refs.carousel.setActiveItem(this.carouselIndex);
      }, 0);
    },
    handleSelectionChange(selection) {
      this.multipleSelection = selection;
    },
    //删除不通过作品
    handleDelWorks(row) {
      this.$confirm(`确定删除作品吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.deleteDetail({ worksIds: [row.worksId] });
        })
        .catch(error => {
          return false;
        });
    },
    //批量推荐
    async handleBatchRecommend() {
      if (!this.multipleSelection.length) {
        this.$message({ message: "请选择你要推荐的作品", type: "warning" });
        return;
      }
      let worksIds = [];
      this.multipleSelection.forEach(elem => {
        worksIds.push(elem.worksId);
      });
      let res = await service.recommendWorks(
        { worksIds, recommend: 1 },
        {
          headers: { "Content-Type": "application/json" }
        }
      );
      if (res.errorCode === 0) {
        this.$refs.singleTable.clearSelection();
        this.$message({ message: "推荐作品成功", type: "success" });
        this.queryWorksDetailList(this.querys);
      }
    },
    //文件超出个数限制时的钩子
    handleExceed(files, fileList) {
      if (files.length > 10) {
        this.$message({
          message: "每次只能上传10张，每张图片不能超过2M，超出请选择压缩包上传",
          type: "warning"
        });
      }
    },
    async submitAssess() {
      this.uploadForm = new FormData();
      this.$refs.uploadImage.submit(); //手动提交
      //通过验证的图片
      if (this.$refs.uploadImage.uploadFiles.length) {
        this.btnLoading = true;
        let config = {
          timeout: 50000, //这里由于上传的压缩包文件过大，从而修改等待时间
          headers: {
            "Content-Type": "multipart/form-data"
          }
        };
        let res = await service.uploadFile(this.uploadForm, config);
        if (res.errorCode === 0) {
          //如果是压缩包
          if (this.form.uploadType) {
            this.form.compressFile = res.data[0];
          } else {
            this.form.images = res.data;
          }
          return true;
        } else {
          return false;
        }
      }
    },
    //压缩包上传
    submitCompressUpload(params) {
      let file = params.file;
      let isLt100M = file.size / 1024 / 1024 < 100;
      let fileName = file.name.split(".");
      const extension = fileName[fileName.length - 1] === "rar";
      const extensions = fileName[fileName.length - 1] === "zip";
      if (!extension && !extensions) {
        this.$alert("请选择rar格式或zip格式的文件", "提示", { type: "error" });
        this.$refs.uploadImage.uploadFiles = [];
        return false;
      }
      if (!isLt100M) {
        this.$alert("压缩文件不能超过100MB!", "提示", { type: "error" });
        this.$refs.uploadImage.uploadFiles = [];
        return false;
      }
      if (extension || extensions) {
        this.uploadForm.append("files", file);
      }
    },
    //图片文件上传 这里是个循环
    submitUpload(params) {
      console.log(params);
      console.log("++++++++++++++++++++++");
      let file = params.file;
      let fileType = file.type;
      let isImage = fileType.indexOf("image") != -1;
      let isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        this.$alert("上传图片大小不能超过5MB!", "提示", { type: "error" });
        this.$refs.uploadImage.uploadFiles = [];
        return false;
      }
      if (!isImage) {
        this.$alert("请选择图片上传", "提示", { type: "error" });
        this.$refs.uploadImage.uploadFiles = [];
        return false;
      }
      if (isImage) {
        //图片上传
        this.uploadForm.append("files", file);
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          //先上传文件
          let res = await this.submitAssess();
          if (res) {
            this.uploadWorks(this.form);
          }
        }
      });
    },
    //作品上传
    async uploadWorks(params = {}) {
      let res = await service.uploadWorks(params, {
        headers: { "Content-Type": "application/json" }
      });
      if (res.errorCode === 0) {
        this.btnLoading = false;
        this.dialogFormVisible = false;
        this.$refs.form.resetFields();
        this.$refs.uploadImage.clearFiles();
        this.form.images = [];
        this.querySchoolCollection(this.query);
      }
    },
    //学生作品查询
    async querySchoolCollection(params = {}) {
      let res = await service.querySchoolCollection(params, {
        headers: { "Content-Type": "application/json" }
      });
      if (res.errorCode === 0) {
        this.tableData = res.data.data || [];
        this.totalCount = res.data.totalCount;
      }
    },
    //作品集详情查询
    async queryWorksDetailList(params = {}) {
      let res = await service.queryWorksDetailList(params, {
        headers: { "Content-Type": "application/json" }
      });
      if (res.errorCode === 0) {
        if (res.data.totalCount) {
          this.dialogWorks = true;
          this.worksData = res.data.data || [];
          this.worksCount = res.data.totalCount;
        } else {
          //当没有数据返回时，则关闭窗口,重新更新列表
          this.dialogWorks = false;
          this.querySchoolCollection(this.query);
        }
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
        this.queryWorksDetailList(this.querys);
      }
    }
  },
  activated() {
    this.querySchoolCollection(this.query);
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
</style>
