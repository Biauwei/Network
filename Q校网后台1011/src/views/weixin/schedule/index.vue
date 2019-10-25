<template>
  <div class="page">
    <div class="page-hd">
      <div class="page-form">
        <el-form class="demo-form-inline" :inline="true" :model="query" size="small">
          <el-form-item label="班级">
            <el-select v-model="query.classId" placeholder="请选择班级查询">
              <el-option
                v-for="item in classList"
                :key="item.classId"
                :label="item.className"
                :value="item.classId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-search" type="primary" @click="handleSearch">查询</el-button>
            <el-button icon="el-icon-plus" type="primary" @click="handleAddTemplate">新增模板</el-button>
            <el-button icon="el-icon-plus" type="primary" @click="handleAdd">新增课表</el-button>
          </el-form-item>
        </el-form>
        <div class="update-btn" v-if="tableData.length">
          <el-button size="small" type="danger" @click="handleDelete">删除课表</el-button>
          <el-button
            size="small"
            type="success"
            :loading="btnLoading"
            @click="handleSaveSchedule"
          >更新课表</el-button>
        </div>
      </div>
    </div>
    <div class="page-bd">
      <!-- 表格数据 -->
      <el-table :data="tableData" style="width: 100%" size="small" border>
        <el-table-column label="课堂时间">
          <template slot-scope="scope">
            <span>{{ scope.row.startTime }}</span>
            <span>至</span>
            <span>{{ scope.row.endTime }}</span>
          </template>
        </el-table-column>

        <!-- 自定义列的遍历-->
        <el-table-column v-for="(item, index) in column" :key="index" :label="item.lable">
          <template slot-scope="scope">
            <!-- <template v-if="scope.row.list[index] != undefined"> -->
            <el-select v-model="scope.row.list[index].lessonId" placeholder="请选择" size="mini">
              <el-option
                v-for="item in lessonList"
                :key="item.lessonId"
                :label="item.title"
                :value="item.lessonId"
              ></el-option>
            </el-select>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- dialog  新增模板 -->
    <el-dialog top="40px" title="新增模板" :visible.sync="dialogFormVisible">
      <el-form
        ref="form"
        :model="form"
        :inline="true"
        status-icon
        size="small"
        :label-width="formLabelWidth"
      >
        <el-form-item
          label="模板名称"
          prop="scheduleName"
          :rules="[
          { required: true, message: '请输入模板名称', trigger: 'blur' }
        ]"
        >
          <el-input v-model="form.scheduleName" placeholder="请输入模板名称"></el-input>
        </el-form-item>
        <!-- <el-form-item>
          <el-button type="primary" @click="handleAddTemplastRow">添加课堂时间</el-button>
        </el-form-item>-->
      </el-form>
      <el-table :data="form.tepmlate" style="width: 100%" size="small" stripe>
        <!-- <el-table-column type="index"></el-table-column> -->
        <el-table-column label="上课时间">
          <template slot-scope="scope">
            <el-time-select
              size="small"
              :clearable="false"
              v-model="scope.row.startTime"
              placeholder="上课时间"
              :picker-options="{
              start: '07:00',
              step: '00:05',
              end: '18:00'
            }"
            ></el-time-select>
          </template>
        </el-table-column>
        <el-table-column label="下课时间">
          <template slot-scope="scope">
            <el-time-select
              size="small"
              :clearable="false"
              v-model="scope.row.endTime"
              placeholder="下课时间"
              :picker-options="{
              start: '07:00',
              step: '00:05',
              end: '18:00',
              minTime: scope.row.startTime
            }"
            ></el-time-select>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="handleAddTemplateRow">新增</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDeleTemplateRow(scope.$index)"
              v-if="scope.$index != 0"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="submitForm('form')">保存</el-button>
      </span>
    </el-dialog>
    <!-- dialog  新增模板 -->
    <!-- dialog  新增课表 -->
    <el-dialog width="80%" top="40px" title="新增课表" :visible.sync="dialogSchedule">
      <el-form ref="scheduleForm" :model="scheduleForm" :inline="true" status-icon size="small">
        <el-form-item
          label="班级"
          prop="classId"
          :rules="[
          { required: true, message: '请选择班级', trigger: 'blur' }
        ]"
        >
          <el-select v-model="scheduleForm.classId" placeholder="班级">
            <el-option
              v-for="item in classList"
              :key="item.classId"
              :label="item.className"
              :value="item.classId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="课表模板"
          prop="scheduleId"
          :rules="[
          { required: true, message: '请选择课表模板', trigger: 'blur' }
        ]"
        >
          <el-select v-model="scheduleForm.scheduleId" placeholder="课表模板">
            <el-option
              v-for="item in scheduleTpl"
              :key="item.scheduleId"
              :label="item.scheduleName"
              :value="item.scheduleId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" type="primary" @click="scheduleForms('scheduleForm')">查询</el-button>
        </el-form-item>
      </el-form>
      <!-- 课表详情数据 -->
      <el-table :data="schedeleTplData" style="width: 100%" size="small" stripe>
        <el-table-column label="课堂时间">
          <template slot-scope="scope">
            <span>{{ scope.row.startTime }}</span>
            <span>至</span>
            <span>{{ scope.row.endTime }}</span>
          </template>
        </el-table-column>
        <!-- 自定义列的遍历-->
        <el-table-column v-for="(item, index) in column" :key="index" :label="item.lable">
          <template slot-scope="scope">
            <el-select v-model="scope.row.list[index].lessonId" placeholder="请选择" size="mini">
              <el-option
                v-for="item in lessonList"
                :key="item.lessonId"
                :label="item.title"
                :value="item.lessonId"
              ></el-option>
            </el-select>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button
          size="small"
          type="primary"
          @click="handleAddSchedule('scheduleForm')"
          v-if="schedeleTplData.length"
        >新增课表</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import service from "@/api";
export default {
  name: "schedule",
  data() {
    return {
      btnLoading: false,
      dialogFormVisible: false,
      dialogSchedule: false,
      formLabelWidth: "100px",
      query: {
        classId: null
      },
      form: {
        schoolId: this.$route.params.id,
        scheduleName: "",
        tepmlate: [{ startTime: "07:00", endTime: "07:45" }]
      },
      scheduleForm: {
        classId: null,
        scheduleId: null
      },
      lessonList: [], //课程数据
      classList: [], //班级数据
      tableData: [], //表格数据
      scheduleTpl: [], //课表模板
      schedeleTplData: [],
      column: [
        {
          day: 1,
          prop: "monday",
          lable: "星期一"
        },
        {
          day: 2,
          prop: "tuesday",
          lable: "星期二"
        },
        {
          day: 3,
          prop: "wednesday",
          lable: "星期三"
        },
        {
          day: 4,
          prop: "thursday",
          lable: "星期四"
        },
        {
          day: 5,
          prop: "friday",
          lable: "星期五"
        }
      ]
    };
  },
  methods: {
    handleSearch() {
      this.queryScheduleList(this.query);
    },
    handleAddTemplate() {
      this.dialogFormVisible = true;
    },
    handleAdd() {
      this.dialogSchedule = true;
    },
    //新增课堂时间段
    handleAddTemplateRow() {
      this.form.tepmlate.push({
        startTime: "",
        endTime: ""
      });
    },
    //删除课堂时间段
    handleDeleTemplateRow(index) {
      this.form.tepmlate.splice(index, 1);
    },
    //更新课表
    handleSaveSchedule() {
      let tableData = this.tableData;
      let schedule = [];
      for (let item of tableData) {
        let list = item.list;
        for (let value of list) {
          let { id, lessonId } = value;
          schedule.push({ id, lessonId });
        }
      }
      //loading
      this.btnLoading = true;
      this.updateSchedule({ schedule });
    },
    //删除课表
    handleDelete() {
      let { classId } = this.query;
      this.$confirm(`确定删除课表吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.deteleSchedule(classId);
        })
        .catch(error => {
          return false;
        });
    },
    //生成课表
    handleAddSchedule() {
      let schedeleTplData = this.schedeleTplData;
      let classId = this.scheduleForm.classId;
      let result = [];
      for (let i = 0; i < schedeleTplData.length; i++) {
        let list = schedeleTplData[i].list;
        for (let s = 0; s < list.length; s++) {
          result.push(list[s]);
        }
      }
      //保存选择的课表
      this.addSchedule({ classId, schedule: result });
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.addScheduleTemplate(this.form);
        }
      });
    },
    scheduleForms(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let { scheduleId } = this.scheduleForm;
          this.queryScheduleTemplateDetail(scheduleId);
        }
      });
    },
    //班级课表列表展示
    async queryScheduleList(params = {}) {
      let res = await service.queryScheduleList(params, {
        headers: { "Content-Type": "application/json" }
      });
      if (res.errorCode === 0) {
        this.tableData = res.data;
      } else {
        this.$message({ message: `没有课表数据哦`, type: "warning" });
      }
    },
    //查询学校课表模板
    async queryScheduleTemplateAll() {
      let schoolId = this.$route.params.id;
      let res = await service.queryScheduleTemplateAll(
        { schoolId },
        {
          headers: { "Content-Type": "application/json" }
        }
      );
      if (res.errorCode === 0) {
        this.scheduleTpl = res.data;
      }
    },
    //课程查询
    async queryLesson(params = {}) {
      let res = await service.queryLesson(params, {
        headers: { "Content-Type": "application/json" }
      });
      if (res.errorCode === 0) {
        this.lessonList = res.data;
        this.lessonList.unshift({ lessonId: 0, title: "无课" });
      }
    },
    //班级查询
    async queryStudentClass() {
      let schoolId = this.$route.params.id;
      let res = await service.queryStudentClass(
        { schoolId },
        {
          headers: { "Content-Type": "application/json" }
        }
      );
      if (res.errorCode === 0) {
        this.classList = res.data;
        //this.query.classId = res.data[0].classId;
        //先查班级，在调用查询列表数据的方法
      }
    },
    //新增模板
    async addScheduleTemplate(params = {}) {
      let res = await service.addScheduleTemplate(params, {
        headers: { "Content-Type": "application/json" }
      });
      if (res.errorCode === 0) {
        this.$message({ message: `${res.data}`, type: "success" });
        this.dialogFormVisible = false;
        this.$refs.form.resetFields();
        //新增成功后重新更新
        this.queryScheduleTemplateAll();
      } else {
        this.$message({ message: `${res.errorMsg}`, type: "warning" });
      }
    },
    //新增课表
    async addSchedule(params = {}) {
      let res = await service.addSchedule(params, {
        headers: { "Content-Type": "application/json" }
      });
      if (res.errorCode === 0) {
        this.dialogSchedule = false;
        this.$refs.scheduleForm.resetFields();
        //清空课表数据
        this.schedeleTplData = [];
        //根据新建的课表查询
        this.query.classId = params.classId;
        this.queryScheduleList(this.query);
      } else {
        this.$message({ message: `${res.errorMsg}`, type: "warning" });
      }
    },
    //修改课表
    async updateSchedule(params = {}) {
      let res = await service.updateSchedule(params, {
        headers: { "Content-Type": "application/json" }
      });
      if (res.errorCode === 0) {
        this.$message({ message: `${res.data}`, type: "success" });
        this.btnLoading = false;
        this.queryScheduleList(this.query);
      }
    },
    //删除课表
    async deteleSchedule(classId) {
      let res = await service.deteleSchedule(
        { classId },
        {
          headers: { "Content-Type": "application/json" }
        }
      );
      if (res.errorCode === 0) {
        this.tableData = [];
        this.$message({ message: `${res.data}`, type: "success" });
      }
    },
    //查询课表模板详情
    async queryScheduleTemplateDetail(scheduleId) {
      let res = await service.queryScheduleTemplateDetail(
        { scheduleId },
        {
          headers: { "Content-Type": "application/json" }
        }
      );
      if (res.errorCode === 0 && res.data.length) {
        let len = res.data.length;
        let result = [];
        for (let i = 0; i < len; i++) {
          let pitchId = res.data[i].pitchId;
          let startTime = res.data[i].startTime;
          let endTime = res.data[i].endTime;
          let list = [];
          for (let s = 1; s <= 5; s++) {
            let obj = {
              lessonId: 0, //默认无课
              pitchId,
              day: s,
              classId: this.scheduleForm.classId || 0
            };
            list.push(obj);
          }
          result.push({ startTime, endTime, list });
        }
        this.schedeleTplData = result;
      }
    }
    //查询默认时间模板
    // async queryTeplateDefault(params = {}) {
    //   let res = await service.queryTeplateDefault(params, {
    //     headers: { "Content-Type": "application/json" }
    //   });
    //   if (res.errorCode === 0) {
    //     this.form.tepmlate = res.data;
    //   }
    // }
  },
  mounted() {
    this.queryStudentClass();
    //this.queryScheduleList(this.query);
    this.queryLesson();
    this.queryScheduleTemplateAll();
    //this.queryTeplateDefault();
  }
};
</script>
<style lang="less" scoped>
.update-btn {
  position: absolute;
  right: 0;
  top: 15px;
  z-index: 10;
}
</style>
