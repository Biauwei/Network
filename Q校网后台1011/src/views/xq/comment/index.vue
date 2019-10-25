<template>
  <div class="page">
    <div class="page-hd">
      <div class="page-form">
        <el-form class="demo-form-inline" :inline="true" :model="query" size="small">
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
        <el-table-column label="ID" prop="labelId"></el-table-column>
        <el-table-column label="学生姓名" prop="labelId"></el-table-column>
        <el-table-column label="点评内容" prop="labelId"></el-table-column>
        <el-table-column label="点评日期" prop="labelId"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="handleAddComment(scope.row)">点评</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- dialog -->
    <el-dialog top="40px" title="学生点评" :visible.sync="dialogFormVisible">
      <el-form ref="form" :model="form" status-icon>
        <el-form-item
          label="点评内容"
          prop="commentContent"
          :rules="[
          { required: true, message: '请输入点评内容', trigger: 'blur' }
        ]"
        >
          <el-input type="textarea" v-model="form.commentContent" :rows="5" placeholder="请输入点评内容"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('form')">提交</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import service from "@/api";
export default {
  name: "",
  data() {
    return {
      dialogFormVisible: false,
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
      tableData: []
    };
  },
  methods: {
    handleSearch() {},
    handleAddComment() {},
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
        }
      });
    },
    //查询学生列表
    async queryStudentList(params = {}) {
      let res = await service.queryStudentList(params, {
        headers: { "Content-Type": "application/json" }
      });
      if (res.errorCode === 0) {
        this.tableData = res.data;
      }
    },
    //添加学生点评
    async addComment(params = {}) {
      let res = await service.addComment(params, {
        headers: { "Content-Type": "application/json" }
      });
    },
    //删除学生点评
    async deleteComment(params = {}) {
      let res = await service.deleteComment(params, {
        headers: { "Content-Type": "application/json" }
      });
    }
  },
  mounted() {
    this.queryStudentList(this.query);
  }
};
</script>
<style lang="less" scoped>
</style>
