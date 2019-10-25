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
          <el-form-item label="班级名称">
            <el-input v-model="query.className" placeholder="请输入标签名称" maxlength="10"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button size="small" icon="el-icon-search" type="primary" @click="handleSearch">查询</el-button>
            <el-button size="small" icon="el-icon-plus" type="primary" @click="handleAdd">新增</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="page-bd">
      <el-table :data="tableData" style="width: 100%" size="small">
        <el-table-column label="序号" prop="classId"></el-table-column>
        <el-table-column label="年级名称" prop="gradeName"></el-table-column>
        <el-table-column label="班级名称" prop="className"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDel(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="page-ft"></div>
    <!-- 新增 or 编辑 -->
    <el-dialog top="40px" title :visible.sync="dialogFormVisible">
      <span slot="title" class="dialog-title">{{ isShow ? '新增': '编辑' }}</span>
      <el-form ref="form" :model="form" status-icon size="small" :label-width="formLabelWidth">
        <el-form-item
          label="年级"
          prop="grade"
          :rules="[
              { required: true, message: '选择年级', trigger: 'blur' }
            ]"
        >
          <el-select v-model="form.grade" placeholder="选择年级">
            <el-option
              v-for="item in gradeList"
              :key="item.gradeId"
              :label="item.gradeName"
              :value="item.gradeId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="班级名称"
          prop="className"
          :rules="[
              { required: true, message: '请输入班级名称', trigger: 'blur' }
            ]"
        >
          <el-input v-model="form.className" placeholder="请输入班级名称"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogFormVisible = false">取消</el-button>
        <el-button size="small" type="primary" @click="submitForm('form')">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import service from "@/api";
import pageMixins from "@/mixins/page";
export default {
  name: "class",
  mixins: [pageMixins],
  data() {
    return {
      query: {
        className: "",
        schoolId: this.$route.params.id,
        grade: 0
      },
      form: {
        className: "",
        grade: null
      },
      gradeList: []
    };
  },
  methods: {
    handleSearch() {
      this.queryClasses(this.query);
    },
    handleAdd() {
      this.dialogFormVisible = true;
      this.form = {};
      this.isShow = true;
    },
    handleEdit(row) {
      this.isShow = false;
      this.dialogFormVisible = true;
      this.form = Object.assign({}, row);
    },
    handleDel(row) {
      this.$confirm(`确定删除吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.deleteClass(row.classId);
        })
        .catch(error => {
          return false;
        });
    },
    //表单提交
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let schoolId = this.$route.params.id;
          Object.assign(this.form, { schoolId });
          if (this.isShow) {
            this.addClass(this.form);
          } else {
            this.updateClass(this.form);
          }
        }
      });
    },
    //查询班级列表（微信端）
    async queryClasses(params = {}) {
      let res = await service.queryClasses(params, {
        headers: { "Content-Type": "application/json" }
      });
      if (res.errorCode === 0) {
        this.tableData = res.data;
      }
    },
    //新增班级信息（微信端）
    async addClass(params = {}) {
      let res = await service.addClass(params, {
        headers: { "Content-Type": "application/json" }
      });
      if (res.errorCode === 0) {
        this.dialogFormVisible = false;
        this.$refs.form.resetFields();
        this.queryClasses(this.query);
      }
    },
    //编辑班级信息（微信端）
    async updateClass(params = {}) {
      let res = await service.updateClass(params, {
        headers: { "Content-Type": "application/json" }
      });
      if (res.errorCode === 0) {
        this.$refs.form.resetFields();
        this.dialogFormVisible = false;
        this.queryClasses(this.query);
      }
    },
    //删除班级信息（微信端）
    async deleteClass(classId) {
      let res = await service.deleteClass(
        { classId },
        {
          headers: { "Content-Type": "application/json" }
        }
      );
      if (res.errorCode === 0) {
        this.queryClasses(this.query);
      }
    },
    //年级查询
    async queryGrade(params = {}) {
      let res = await service.queryGrade(params, {
        headers: { "Content-Type": "application/json" }
      });
      if (res.errorCode === 0) {
        this.gradeList = res.data;
      }
    }
  },
  activated() {
    this.queryClasses(this.query);
    this.queryGrade();
  }
};
</script>
<style lang="less" scoped>
</style>
