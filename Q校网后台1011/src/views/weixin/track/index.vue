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
          <el-form-item label="老师姓名">
            <el-input v-model="query.teacherName" placeholder="请输入老师姓名" maxlength="10"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button size="small" icon="el-icon-search" type="primary" @click="handleSearch">查询</el-button>
            <el-button size="small" icon="el-icon-plus" type="primary" @click="handleAdd">新增</el-button>
            <!-- accept=".doc,.docx,.xls,.xlsx,.ppt,.pptx,.pdf,.zip,.rar" -->
            <el-upload
              class="upload-excel"
              ref="excel"
              list-type="text"
              :multiple="false"
              :with-credentials="true"
              :show-file-list="false"
              action
              accept=".xls, .xlsx"
              :before-upload="beforeUpload"
            >
              <el-button size="small" icon="el-icon-plus" type="primary">文件导入上传</el-button>
            </el-upload>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="page-bd">
      <el-table :data="tableData" style="width: 100%" size="small">
        <el-table-column label="序号" prop="teacherId"></el-table-column>
        <el-table-column label="老师姓名" prop="teacherName"></el-table-column>
        <el-table-column label="性别" prop="sex">
          <template slot-scope="scope">
            <span v-if="scope.row.sex === 1">男</span>
            <span v-else>女</span>
          </template>
        </el-table-column>
        <el-table-column label="手机号" prop="tel"></el-table-column>
        <el-table-column label="职务类别" prop="type">
          <template slot-scope="scope">
            <span v-if="scope.row.type">老师</span>
            <span v-else>管理员</span>
          </template>
        </el-table-column>
        <el-table-column label="任教班级" prop="className">
          <template slot-scope="scope">
            <el-dropdown>
              <el-button size="mini" type="primary">
                查看
                <i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  v-for="name in scope.row.classNames"
                  :key="name.classId"
                >{{ name.className }}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
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

    <!-- 新增 or 编辑 -->
    <el-dialog top="40px" title :visible.sync="dialogFormVisible">
      <span slot="title" class="dialog-title">{{ isShow ? '新增': '编辑' }}</span>
      <el-form
        :rules="rules"
        ref="form"
        :model="form"
        status-icon
        size="small"
        :label-width="formLabelWidth"
      >
        <el-form-item label="老师名称" prop="teacherName">
          <el-input v-model="form.teacherName" placeholder="输入老师名称"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-select v-model="form.sex" placeholder="选择性别">
            <el-option v-for="item in sexList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="手机号" prop="tel">
          <el-input v-model="form.tel" placeholder="输入手机号"></el-input>
        </el-form-item>
        <el-form-item label="类别" prop="type">
          <el-select v-model="form.type" placeholder="选择职位类别">
            <el-option v-for="item in typeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="任教班级" prop="classIds">
          <el-select
            multiple
            collapse-tags
            v-model="form.classIds"
            value-key="classId"
            placeholder="选择任教班级"
          >
            <el-option
              v-for="item in classList"
              :key="item.classId"
              :label="item.className"
              :value="item.classId"
            ></el-option>
          </el-select>
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
import { sex, type } from "@/mixins";
import pageMixins from "@/mixins/page";
import { isPhone } from "@/utils/validator";
export default {
  name: "track",
  mixins: [sex, type, pageMixins],
  data() {
    return {
      query: {
        grade: 0,
        classId: 0,
        teacherName: "",
        schoolId: this.$route.params.id
      },
      form: {
        teacherName: "",
        sex: 1,
        tel: "",
        type: 1,
        classIds: []
      },
      rules: {
        teacherName: [
          {
            required: true,
            message: "输入老师名称",
            trigger: "blur"
          }
        ],
        sex: [
          {
            required: true,
            message: "选择性别",
            trigger: "blur"
          }
        ],
        tel: [
          {
            required: true,
            message: "手机号不能为空",
            trigger: "blur"
          },
          {
            required: true,
            validator: isPhone,
            trigger: "blur"
          }
        ],
        type: [
          {
            required: true,
            message: "选择职位类别",
            trigger: "blur"
          }
        ],
        classIds: [
          {
            required: true,
            message: "选择任教班级",
            trigger: "blur"
          }
        ]
      },
      classList: []
    };
  },
  methods: {
    //上传文件之前
    async beforeUpload(file) {
      let schoolId = this.$route.params.id; //微信端学校Id
      let fileName = [];
      fileName = file.name.split(".");
      const extension = fileName[fileName.length - 1] === "xls";
      const extensions = fileName[fileName.length - 1] === "xlsx";
      if (!extension && !extensions) {
        this.$message({
          message: "文件只能是xls、xlsx格式!",
          type: "warning"
        });
      }
      if (extension || extensions) {
        let config = {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        };
        let uploadForm = new FormData();
        uploadForm.append("file", file);
        uploadForm.append("schoolId", schoolId);
        let res = await service.teacherBatchAdd(uploadForm, config);
        if (res.errorCode === 0) {
          this.$alert("导入成功", "提示", {
            confirmButtonText: "确定",
            type: "success"
          });
          this.queryTeachers(this.query);
        }
      }
      return extension || extensions;
    },
    handleCurrentChange(curr) {
      this.query.page = curr;
      this.queryTeachers(this.query);
    },
    handleSizeChange(size) {
      this.query.pageSize = size;
      this.queryTeachers(this.query);
    },
    handleSearch() {
      this.queryTeachers(this.query);
    },
    handleAdd() {
      this.dialogFormVisible = true;
      this.form = {
        classIds: []
      };
      this.isShow = true;
    },
    handleEdit(row) {
      let { classNames, ...args } = row;
      let classIds = classNames.map(item => item.classId);
      this.isShow = false;
      this.dialogFormVisible = true;
      this.form = Object.assign({}, args, { classIds });
    },
    handleDel(row) {
      this.$confirm(`确定删除吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.deleteTeacher(row.teacherId);
        })
        .catch(error => {
          return false;
        });
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let schoolId = this.$route.params.id;
          Object.assign(this.form, { schoolId });
          if (this.isShow) {
            this.addTeacher(this.form);
          } else {
            this.updateTeacher(this.form);
          }
        }
      });
    },
    //查询老师列表（微信端）
    async queryTeachers(params = {}) {
      let res = await service.queryTeachers(params, {
        headers: { "Content-Type": "application/json" }
      });
      if (res.errorCode === 0) {
        this.tableData = res.data.data;
        this.totalCount = res.data.totalCount;
      }
    },
    //录入老师信息（微信端）
    async addTeacher(params = {}) {
      let res = await service.addTeacher(params, {
        headers: { "Content-Type": "application/json" }
      });
      if (res.errorCode === 0) {
        this.dialogFormVisible = false;
        this.$refs.form.resetFields();
        this.queryTeachers(this.query);
      }
    },
    //删除老师信息（微信端）
    async deleteTeacher(teacherId) {
      let res = await service.deleteTeacher(
        { teacherId },
        {
          headers: { "Content-Type": "application/json" }
        }
      );
      if (res.errorCode === 0) {
        this.queryTeachers(this.query);
      }
    },
    //编辑老师信息（微信端）
    async updateTeacher(params = {}) {
      let res = await service.updateTeacher(params, {
        headers: { "Content-Type": "application/json" }
      });
      if (res.errorCode === 0) {
        this.dialogFormVisible = false;
        this.$refs.form.resetFields();
        this.queryTeachers(this.query);
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
      }
    }
  },
  mounted() {
    this.queryTeachers(this.query);
    this.querySchoolClass();
  }
};
</script>
<style lang="less" scoped>
.upload-excel {
  display: inline-block;
  margin-left: 10px;
}
</style>
