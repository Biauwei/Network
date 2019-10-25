<template>
  <div class="page">
    <div class="page-hd">
      <div class="page-form">
        <el-form class="demo-form-inline" :inline="true" :model="query" size="small">
          <el-form-item label="学校名称">
            <el-input v-model="query.schoolName" placeholder="请输入学校名称"></el-input>
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
        <el-table-column label="序号" prop="paperId"></el-table-column>
        <el-table-column label="所属年级" prop="gradeName"></el-table-column>
        <el-table-column label="学校名称" prop="schoolName"></el-table-column>
        <el-table-column label="所属科目" prop="lessonTitie"></el-table-column>
        <el-table-column label="文件名称" prop="title" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="说明" prop="textContent" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="资费" prop="fee"></el-table-column>
        <el-table-column label="文档" prop="wordUrl">
          <template slot-scope="scope">
            <a :href="scope.row.wordUrl" style="color:#409EFF;cursor:pointer;">下载文档</a>
          </template>
        </el-table-column>
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
    <!-- dialog -->
    <el-dialog top="40px" :visible.sync="dialogFormVisible">
      <span slot="title" class="dialog-title">{{ isShow ? '新增': '编辑' }}</span>
      <el-form ref="form" :model="form" status-icon size="small" :label-width="formLabelWidth">
        <el-form-item
          label="学校名称"
          prop="title"
          :rules="[
          { required: true, message: '请输入学校名称', trigger: 'blur' }
        ]"
        >
          <el-input v-model="form.schoolName" placeholder="请输入学校名称"></el-input>
        </el-form-item>
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
          { required: true, message: '请选择学科', trigger: 'blur' }
        ]"
        >
          <el-select v-model="form.lessonId" placeholder="学科">
            <el-option
              v-for="item in lessonList.slice(1)"
              :key="item.lessonId"
              :label="item.title"
              :value="item.lessonId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="试卷名称"
          prop="title"
          :rules="[
          { required: true, message: '请输入试卷名称', trigger: 'blur' }
        ]"
        >
          <el-input v-model="form.title" placeholder="请输入试卷名称"></el-input>
        </el-form-item>
        <el-form-item
          label="试卷说明"
          prop="textContent"
          :rules="[
              { required: true, message: '请输入试卷说明', trigger: 'blur' }
            ]"
        >
          <el-input type="textarea" v-model="form.textContent" :rows="6" placeholder="请输入试卷说明"></el-input>
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
          label="word文件"
          prop="wordUrl"
          :rules="[
          { required: true, message: '请上传word文件', trigger: 'blur' }
        ]"
        >
          <el-upload
            name="file"
            ref="uploadVideo"
            :show-file-list="true"
            :file-list="fileList"
            :multiple="false"
            :with-credentials="true"
            action="/qxiao-cms/action/mod-xiaojiao/weixin/paper/fileUploadWord.do"
            accept=".doc, .docx"
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
  name: "paper",
  data() {
    return {
      videoUrl: "",
      dialogFormVisible: false,
      isShow: false, //判断dialog弹窗是新增还是编辑
      formLabelWidth: "100px",
      fileList: [],
      query: {
        schoolName: "",
        gradeId: 0,
        lessonId: 0,
        page: 1,
        pageSize: 20
      },
      form: {
        schoolName: "",
        gradeId: null,
        lessonId: null,
        title: "",
        textContent: "",
        fee: "",
        wordUrl: ""
      },
      gradeList: [],
      lessonList: [],
      tableData: [],
      totalCount: 0
    };
  },
  methods: {
    handleSearch() {
      this.queryPaperList(this.query);
    },
    handleCurrentChange(curr) {
      this.query.page = curr;
      this.queryPaperList(this.query);
    },
    handleSizeChange(size) {
      this.query.pageSize = size;
      this.queryPaperList(this.query);
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
        let v = row.wordUrl.split("/");
        let obj = {
          name: v[v.length - 1], //取数组最后一个元素
          url: row.wordUrl
        };
        this.fileList.push(obj);
      }
    },
    handleDel(row) {
      let { paperId } = row;
      this.$confirm(`确定删除吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.deletePaperId(paperId);
        })
        .catch(error => {
          return false;
        });
    },
    //上传文件之前的钩子
    beforeVideoUpload(file) {
      let fileName = [];
      fileName = file.name.split(".");
      const extension = fileName[fileName.length - 1] === "doc";
      const extensions = fileName[fileName.length - 1] === "docx";
      if (!extension && !extensions) {
        this.$message({
          message: "文件只能是doc、docx格式!",
          type: "warning"
        });
        return false;
      }
      if (extension || extensions) {
        return true;
      }
    },
    //文件上传成功时的钩子
    handleVideoSuccess(response, file, fileList) {
      if (response.errorCode === 0) {
        this.form.wordUrl = response.data.url;
      }
    },
    //删除文件之前的钩子
    handleBeforeRemove(file, fileList) {
      if (file && file.status === "success") {
        this.form.wordUrl = "";
      } else {
        return false;
      }
    },
    //表单提交
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.isShow) {
            this.addPaperVideo(this.form);
          } else {
            this.updatePaper(this.form);
          }
        }
      });
    },
    //新增试卷视频
    async addPaperVideo(params = {}) {
      let res = await service.addPaperVideo(params, {
        headers: { "Content-Type": "application/json" }
      });
      if (res.errorCode === 0) {
        this.dialogFormVisible = false;
        this.$refs.form.resetFields();
        this.$refs.uploadVideo.clearFiles(); //清空已上传的文件列表
        this.queryPaperList(this.query);
      }
    },
    //修改试卷
    async updatePaper(params = {}) {
      let res = await service.updatePaper(params, {
        headers: { "Content-Type": "application/json" }
      });
      if (res.errorCode === 0) {
        this.dialogFormVisible = false;
        this.$refs.form.resetFields();
        this.$refs.uploadVideo.clearFiles(); //清空已上传的文件列表
        this.queryPaperList(this.query);
      }
    },
    //视频列表查询
    async queryPaperList(params = {}) {
      let res = await service.queryPaperList(params, {
        headers: { "Content-Type": "application/json" }
      });
      if (res.errorCode === 0) {
        this.tableData = res.data.data;
        this.totalCount = res.data.totalCount;
      }
    },
    //删除试卷
    async deletePaperId(paperId) {
      let res = await service.deletePaperId(
        { paperId },
        {
          headers: { "Content-Type": "application/json" }
        }
      );
      if (res.errorCode === 0) {
        this.queryPaperList(this.query);
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
    this.queryPaperList(this.query);
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
