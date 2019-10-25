<template>
  <div class="page">
    <div class="page-hd">
      <div class="page-form">
        <el-form class="demo-form-inline" :inline="true" :model="query" size="small">
          <el-form-item label="班级">
            <el-select v-model="query.classId" placeholder="选择班级">
              <el-option
                v-for="item in classList"
                :key="item.classId"
                :label="item.className"
                :value="item.classId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="学生姓名">
            <el-input v-model="query.studentName" placeholder="请输入学生姓名"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-search" type="primary" @click="handleSearch">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="page-bd">
      <!-- 表格数据 -->
      <el-table :data="tableData" style="width: 100%" size="small">
        <el-table-column label="序号" prop="studentId"></el-table-column>
        <el-table-column label="学生姓名" prop="studentName"></el-table-column>
        <el-table-column label="点评内容">
          <template slot-scope="scope">
            <span style="color:#409EFF;cursor:pointer;" @click="handleViewComment(scope.row)">查看</span>
          </template>
        </el-table-column>
        <el-table-column label="点评日期" prop="date"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="handleAddComment(scope.row)">点评</el-button>
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
    <el-dialog top="40px" title="学生点评" :visible.sync="dialogFormVisible" @open="handleOpen">
      <el-form ref="form" :model="form" status-icon size="small" :label-width="formLabelWidth">
        <el-form-item
          label="点评内容"
          prop="commentContent"
          :rules="[
          { required: true, message: '请输入点评内容', trigger: 'blur' }
        ]"
        >
          <el-input type="textarea" v-model="form.commentContent" :rows="5" placeholder="请输入点评内容"></el-input>
        </el-form-item>
        <el-form-item
          label="点评老师"
          prop="teacherId"
          :rules="[
          { required: true, message: '请选择点评老师', trigger: 'blur' }
        ]"
        >
          <el-select v-model="form.teacherId" placeholder="请选择点评老师">
            <el-option
              v-for="item in teacherList"
              :key="item.teacherId"
              :label="item.teacherName"
              :value="item.teacherId"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="submitForm('form')">提交</el-button>
      </span>
    </el-dialog>
    <!-- 单个学生点评详情列表查看 -->
    <el-dialog width="80%" top="40px" title="点评详情查看" :visible.sync="dialogViewComment">
      <el-table :data="viewCommentData" style="width: 100%" stripe size="small">
        <el-table-column label="ID" prop="id"></el-table-column>
        <el-table-column label="学生姓名" prop="studentName"></el-table-column>
        <el-table-column label="点评内容" prop="commentContent"></el-table-column>
        <el-table-column label="老师" prop="teacherName"></el-table-column>
        <el-table-column label="点评日期" prop="postTime"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDel(scope.row, scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>
<script>
import service from "@/api";
export default {
  name: "studentComment",
  data() {
    return {
      dialogViewComment: false,
      dialogFormVisible: false,
      isShow: false, //判断dialog弹窗是新增还是编辑
      formLabelWidth: "100px",
      query: {
        classId: null,
        studentName: "",
        page: 1,
        pageSize: 20
      },
      form: {
        studentId: null,
        commentContent: "",
        teacherId: null
      },
      viewCommentData: [],
      tableData: [],
      totalCount: 0,
      classList: [],
      teacherList: []
    };
  },
  methods: {
    handleSearch() {
      this.queryStudentList(this.query);
    },
    handleCurrentChange(curr) {
      this.query.page = curr;
      this.queryStudentList(this.query);
    },
    handleSizeChange(size) {
      this.query.pageSize = size;
      this.queryStudentList(this.query);
    },
    handleOpen() {
      this.queryTeacherWithClassId(this.query.classId);
    },
    //查看点评内容列表
    handleViewComment(row) {
      this.dialogViewComment = true;
      this.queryCommentList(row.studentId);
    },
    handleAddComment(row) {
      this.isShow = true;
      this.form.studentId = row.studentId;
      this.dialogFormVisible = true;
    },
    handleDel(row, index) {
      this.$confirm(`确定删除吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          let result = this.deleteComment(row.id);
          if (result) {
            this.viewCommentData.splice(index, 1);
          }
        })
        .catch(error => {
          return false;
        });
    },
    handleEdit(row) {
      this.isShow = false;
      this.dialogFormVisible = true;
      this.form = Object.assign({}, row);
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.isShow) {
            this.addComment(this.form);
          } else {
            this.updateComment(this.form);
          }
        }
      });
    },
    //查询老师列表（微信端）
    async queryTeacherWithClassId(classId) {
      let res = await service.queryTeacherWithClassId(
        { classId },
        {
          headers: { "Content-Type": "application/json" }
        }
      );
      if (res.errorCode === 0) {
        this.teacherList = res.data;
      }
    },
    //查询学生点评列表
    async queryCommentList(studentId) {
      let res = await service.queryCommentList(
        { studentId },
        {
          headers: { "Content-Type": "application/json" }
        }
      );
      if (res.errorCode === 0) {
        this.viewCommentData = res.data;
      }
    },
    //查询学生列表
    async queryStudentList(params = {}) {
      let res = await service.queryStudentList(params, {
        headers: { "Content-Type": "application/json" }
      });
      if (res.errorCode === 0) {
        this.tableData = res.data.data;
        this.totalCount = res.data.totalCount;
      }
    },
    //添加学生点评
    async addComment(params = {}) {
      let res = await service.addComment(params, {
        headers: { "Content-Type": "application/json" }
      });
      if (res.errorCode === 0) {
        this.dialogFormVisible = false;
        this.$refs.form.resetFields();
        this.queryStudentList(this.query);
      }
    },
    //删除学生点评
    async deleteComment(id) {
      let res = await service.deleteComment(
        { id },
        {
          headers: { "Content-Type": "application/json" }
        }
      );
      if (res.errorCode === 0) {
        return true;
      }
    },
    //修改学生点评
    async updateComment(params = {}) {
      let res = await service.updateComment(params, {
        headers: { "Content-Type": "application/json" }
      });
      if (res.errorCode === 0) {
        this.dialogFormVisible = false;
        this.$refs.form.resetFields();
        this.queryCommentList(params.studentId);
      }
    },
    //查询学生点评（单条）
    async queryComment(params = {}) {
      let res = await service.queryComment(params, {
        headers: { "Content-Type": "application/json" }
      });
      if (res.errorCode === 0) {
      }
    },
    //查询班级列表（微信端）
    async querySchoolClass() {
      let schoolId = this.$route.params.id;
      let res = await service.querySchoolClass(
        { schoolId },
        {
          headers: { "Content-Type": "application/json" }
        }
      );
      if (res.errorCode === 0) {
        this.classList = res.data;
        this.query.classId = res.data[0].classId;
        this.queryStudentList(this.query);
      }
    }
  },
  mounted() {
    this.querySchoolClass();
  }
};
</script>
<style lang="less" scoped>
</style>
