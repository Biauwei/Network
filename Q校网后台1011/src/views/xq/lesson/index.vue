<template>
  <div class="page">
    <div class="page-hd">
      <div class="page-form">
        <el-form class="demo-form-inline" :inline="true" :model="query" size="small">
          <el-form-item label="课程名称">
            <el-input v-model="query.lessonName" placeholder="请输入课程名称"></el-input>
          </el-form-item>
          <el-form-item label="年级">
            <el-select v-model="query.gradeId" placeholder="年级">
              <el-option
                v-for="item in gradeList"
                :key="item.gradeId"
                :label="item.gradeName"
                :value="item.gradeId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="科目">
            <el-select v-model="query.lessonId" placeholder="科目">
              <el-option
                v-for="item in lessonList"
                :key="item.lessonId"
                :label="item.title"
                :value="item.lessonId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-search" type="primary" @click="handleSearch">查询</el-button>
            <el-button icon="el-icon-plus" type="primary" @click="handleAdd">新增</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="page-bd">
      <!-- 表格数据 -->
      <el-table :data="tableData" style="width: 100%" size="small">
        <el-table-column label="序号" prop="id"></el-table-column>
        <el-table-column label="年级名称" prop="gradeName"></el-table-column>
        <el-table-column label="科目" prop="title"></el-table-column>
        <el-table-column label="课程名称" prop="lessonName"></el-table-column>
        <el-table-column label="课程说明" prop="textContent"></el-table-column>
        <el-table-column label="课程视频" prop="videoUrl">
          <template slot-scope="scope">
            <span style="color:#409EFF;cursor:pointer;" @click="handleViewVideo(scope.row)">查看</span>
          </template>
        </el-table-column>
        <el-table-column label="资费" prop="fee"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDel(scope.row)">删除</el-button>
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
    <!-- 视频查看 -->
    <el-dialog
      width="500px"
      custom-class="qx-dialog"
      top="40px"
      title="视频查看"
      :visible.sync="dialogViewVideo"
    >
      <div class="video">
        <video :src="videoUrl" controls loop></video>
      </div>
    </el-dialog>
    <!-- dialog -->
    <el-dialog top="40px" :visible.sync="dialogFormVisible">
      <span slot="title" class="dialog-title">{{ isShow ? '新增': '编辑' }}</span>
      <el-form ref="form" :model="form" status-icon size="small" :label-width="formLabelWidth">
        <el-form-item
          label="年级"
          prop="gradeId"
          :rules="[
          { required: true, message: '请选择年级', trigger: 'blur' }
        ]"
        >
          <el-select v-model="form.gradeId" placeholder="年级">
            <el-option
              v-for="item in gradeList.slice(1)"
              :key="item.gradeId"
              :label="item.gradeName"
              :value="item.gradeId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="科目"
          prop="lessonId"
          :rules="[
          { required: true, message: '请选择科目', trigger: 'blur' }
        ]"
        >
          <el-select v-model="form.lessonId" placeholder="科目">
            <el-option
              v-for="item in lessonList.slice(1)"
              :key="item.lessonId"
              :label="item.title"
              :value="item.lessonId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="课程名称"
          prop="lessonName"
          :rules="[
          { required: true, message: '请输入课程名称', trigger: 'blur' }
        ]"
        >
          <el-input v-model="form.lessonName" placeholder="请输入课程名称"></el-input>
        </el-form-item>
        <el-form-item
          label="课程说明"
          prop="textContent"
          :rules="[
              { required: true, message: '请输入课程说明', trigger: 'blur' }
            ]"
        >
          <el-input type="textarea" v-model="form.textContent" :rows="6" placeholder="请输入课程说明"></el-input>
        </el-form-item>
        <el-form-item
          label="资费"
          prop="fee"
          :rules="[
          { required: true, message: '请输入资费', trigger: 'blur' }
        ]"
        >
          <el-input v-model="form.fee" placeholder="请输入资费" style="width:215px">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item
          label="上传视频"
          prop="videoUrl"
          :rules="[
          { required: true, message: '请上传视频', trigger: 'blur' }
        ]"
        >
          <el-upload
            name="file"
            ref="uploadVideo"
            :show-file-list="true"
            :file-list="fileList"
            :multiple="false"
            :with-credentials="true"
            action="/qxiao-cms/action/mod-xiaojiao/weixin/paper/fileUploadVideo.do"
            accept="video/mp4, video/flv, video/mov"
            :on-success="handleVideoSuccess"
            :before-remove="handleBeforeRemove"
            :before-upload="beforeVideoUpload"
          >
            <el-button size="small" type="primary">上传</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="submitForm('form')">提交</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import service from "@/api";
export default {
  name: "lesson",
  data() {
    return {
      dialogViewVideo: false,
      dialogFormVisible: false,
      videoUrl: "",
      isShow: false, //判断dialog弹窗是新增还是编辑
      formLabelWidth: "100px",
      fileList: [],
      query: {
        gradeId: 0,
        lessonId: 0,
        lessonName: "",
        page: 1,
        pageSize: 20
      },
      form: {
        gradeId: null,
        lessonId: null,
        lessonName: "",
        textContent: "",
        fee: 0,
        videoUrl: ""
      },
      gradeList: [],
      lessonList: [],
      tableData: [],
      totalCount: 0
    };
  },
  methods: {
    handleSearch() {
      this.queryVideoLessonList(this.query);
    },
    handleCurrentChange(curr) {
      this.query.page = curr;
      this.queryVideoLessonList(this.query);
    },
    handleSizeChange(size) {
      this.query.pageSize = size;
      this.queryVideoLessonList(this.query);
    },
    handleAdd() {
      this.isShow = true;
      this.dialogFormVisible = true;
      this.form = {};
    },
    handleEdit(row) {
      //清除文件列表
      this.fileList = [];
      this.isShow = false;
      this.dialogFormVisible = true;
      this.form = Object.assign({}, row);
      if (row) {
        let v = row.videoUrl.split("/");
        let obj = {
          name: v[v.length - 1], //取数组最后一个元素
          url: row.videoUrl
        };
        this.fileList.push(obj);
      }
    },
    handleDel(row) {
      this.$confirm(`确定删除吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.deleteVideoLesson(row.id);
        })
        .catch(error => {
          return false;
        });
    },
    handleViewVideo(row) {
      this.videoUrl = row.videoUrl;
      this.dialogViewVideo = true;
    },
    //上传文件之前的钩子
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
    //文件上传成功时的钩子
    handleVideoSuccess(response, file, fileList) {
      if (response.errorCode === 0) {
        this.form.videoUrl = response.data.url;
      }
    },
    //删除文件之前的钩子
    handleBeforeRemove(file, fileList) {
      if (file && file.status === "success") {
        this.form.videoUrl = "";
      } else {
        return false;
      }
    },
    //表单提交
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.isShow) {
            this.addVideoLesson(this.form);
          } else {
            this.updateVideoLesson(this.form);
          }
        }
      });
    },
    //添加课程视频
    async addVideoLesson(params = {}) {
      let res = await service.addVideoLesson(params, {
        headers: { "Content-Type": "application/json" }
      });
      if (res.errorCode === 0) {
        this.dialogFormVisible = false;
        this.$refs.form.resetFields();
        this.$refs.uploadVideo.clearFiles(); //清空已上传的文件列表
        this.queryVideoLessonList(this.query);
      }
    },
    //修改课程
    async updateVideoLesson(params = {}) {
      let res = await service.updateVideoLesson(params, {
        headers: { "Content-Type": "application/json" }
      });
      if (res.errorCode === 0) {
        this.dialogFormVisible = false;
        this.$refs.form.resetFields();
        this.$refs.uploadVideo.clearFiles(); //清空已上传的文件列表
        this.queryVideoLessonList(this.query);
      }
    },
    //删除课程
    async deleteVideoLesson(id) {
      let res = await service.deleteVideoLesson(
        { id },
        {
          headers: { "Content-Type": "application/json" }
        }
      );
      if (res.errorCode === 0) {
        this.queryVideoLessonList(this.query);
      }
    },
    //视频课程列表
    async queryVideoLessonList(params = {}) {
      let res = await service.queryVideoLessonList(params, {
        headers: { "Content-Type": "application/json" }
      });
      if (res.errorCode === 0) {
        this.tableData = res.data.data;
        this.totalCount = res.data.totalCount;
      }
    },
    //年级查询
    async queryGrade(params = {}) {
      let res = await service.queryGrade(params, {
        headers: { "Content-Type": "application/json" }
      });
      if (res.errorCode === 0) {
        this.gradeList = res.data;
        this.gradeList.unshift({ gradeId: 0, gradeName: "全部" });
      }
    },
    //课程查询
    async queryLesson(params = {}) {
      let res = await service.queryLesson(params, {
        headers: { "Content-Type": "application/json" }
      });
      if (res.errorCode === 0) {
        this.lessonList = res.data;
        this.lessonList.unshift({ lessonId: 0, title: "全部" });
      }
    }
  },
  mounted() {
    this.queryVideoLessonList(this.query);
    this.queryGrade();
    this.queryLesson();
  }
};
</script>
<style lang="less" scoped>
.video {
  width: 500px;
  height: 500px;
  video {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
}
</style>
