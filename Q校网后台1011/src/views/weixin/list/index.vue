
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
          <el-form-item label="学校名称">
            <el-input v-model="query.schoolName" placeholder="请输入学校名称" maxlength="10"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button size="small" icon="el-icon-search" type="primary" @click="handleSearch">查询</el-button>
            <el-button
              v-if="schoolId === 0"
              size="small"
              icon="el-icon-plus"
              type="primary"
              @click="handleAdd"
            >新增</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="page-bd">
      <el-table :data="tableData" style="width: 100%" size="small">
        <el-table-column label="学校ID" prop="schoolId"></el-table-column>
        <el-table-column label="学校名称" prop="schoolName"></el-table-column>
        <el-table-column label="手机号" prop="tel"></el-table-column>
        <el-table-column label="操作" width="766">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="handleEdit(scope.row)"
              v-if="schoolId === 0"
            >编辑</el-button>
            <el-button size="mini" type="primary" @click="handleOpen(scope.row.schoolId, 1)">班级管理</el-button>
            <el-button size="mini" type="primary" @click="handleOpen(scope.row.schoolId, 2)">老师管理</el-button>
            <el-button size="mini" type="primary" @click="handleOpen(scope.row.schoolId, 3)">学生管理</el-button>
            <el-button size="mini" type="primary" @click="handleOpen(scope.row.schoolId, 4)">学生点评</el-button>
            <el-button size="mini" type="primary" @click="handleOpen(scope.row.schoolId, 5)">成绩管理</el-button>
            <el-button size="mini" type="primary" @click="handleOpen(scope.row.schoolId, 6)">课表管理</el-button>
            <el-button size="mini" type="primary" @click="punchTableBtn(scope.row.schoolId, 7)">考勤导出</el-button>
            <!-- <el-button size="mini" type="primary" @click="handleOpen(scope.row.schoolId, 7)">打卡统计</el-button>
            <el-button size="mini" type="primary" @click="handleOpen(scope.row.schoolId, 8)">打卡轨迹</el-button>-->
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
    <el-dialog top="40px" :visible.sync="dialogFormVisible">
      <span slot="title" class="dialog-title">{{ isShow ? '新增': '编辑' }}</span>
      <el-form
        :rules="rules"
        ref="form"
        :model="form"
        status-icon
        size="small"
        :label-width="formLabelWidth"
      >
        <el-form-item label="区域选择" prop="regionIds">
          <qx-region @last="queryRegion" v-model="form.regionIds"></qx-region>
        </el-form-item>
        <el-form-item label="学校名称" prop="terminalSchoolId">
          <el-select
            v-model="form.terminalSchoolId"
            clearable
            placeholder="选择学校"
            @change="handleChangeSchool"
          >
            <el-option
              v-for="item in schoolList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="手机号" prop="tel">
          <el-input v-model="form.tel" placeholder="请输入手机号"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogFormVisible = false">取消</el-button>
        <el-button size="small" type="primary" @click="submitForm('form')">确定</el-button>
      </span>
    </el-dialog>

    <!-- 考勤导出 -->
    <div class="derive_box" v-if="schoolgradeName.length>0">
      <el-dialog top="40px" :visible.sync="attendanceSheet">
        <p class="derive">考勤导出</p>
        <el-form :inline="true" :model="form" class="demo-form-inline" :rules="rules" ref="form">
          <!-------------------------------------------------------------------------------- -->
          <div class="block">
            <el-form-item label="开始时间" prop="startTime">
              <el-date-picker
                v-model="form.startTime"
                ref="startTime"
                type="datetime"
                placeholder="选择日期时间"
                value-format="timestamp"
                @blur="BeginFocus"
              >></el-date-picker>
            </el-form-item>
          </div>

          <div class="block">
            <el-form-item label="结束时间" prop="endTime">
              <el-date-picker
                v-model="form.endTime"
                ref="endTime"
                type="datetime"
                placeholder="选择日期时间"
                value-format="timestamp"
                @blur="endFocus"
              ></el-date-picker>
            </el-form-item>
          </div>
          <!-- ------------------------------------------------------------------------------ -->
          <el-form-item label="选择年级" prop="gradeClass">
            <el-select
              v-model="form.gradeClass"
              placeholder="请选择年级"
              ref="gradeClass"
              @change="getIndex"
            >
              <el-option
                v-for="(item,index) in schoolgradeName"
                :key="item.classId"
                :label="item.gradeName"
                :value="index"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="选择班级" prop="whatClass">
            <el-select
              v-model="form.whatClass"
              placeholder="请选择班级"
              ref="whatClass"
              @change="getClassId"
            >
              <el-option
                v-for="(item,index) in schoolgradeName[classIndex].classes"
                :key="item.id"
                :label="item.className"
                :value="index"
              ></el-option>
            </el-select>
          </el-form-item>
          <!-- ----------------------------------------------------------------------------- -->
          <el-form-item>
            <el-button type="primary" @click="onSubmit('form')">导出Excel</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import service from "@/api";
import region from "@/components/region";
import { isPhone } from "@/utils/validator";
import { mapGetters } from "vuex";
import pageMixins from "@/mixins/page";
import qs from "qs";
export default {
  name: "weixinSchool",
  components: {
    "qx-region": region
  },
  mixins: [pageMixins],
  data() {
    return {
      //考勤导出============
      attendanceSheet: false,
      schoolgradeName: [],
      schoolClasses: [],
      innerUrl: "",
      array1: [],
      array2: [],
      classIndex: 0,
      ClassId: "",

      query: {
        schoolName: "",
        leaderName: ""
      },

      form: {
        tel: "",
        schoolName: "",
        terminalSchoolId: null,
        gradeClass: "",
        whatClass: "",
        startTime: "",
        endTime: ""
      },
      rules: {
        startTime: [
          {
            required: true,
            message: "请选择开始时间",
            trigger: "blur"
          }
        ],
        endTime: [
          {
            required: true,
            message: "请选择结束时间",
            trigger: "blur"
          }
        ],
        gradeClass: [
          {
            required: true,
            message: "请选择年级",
            trigger: "blur"
          }
        ],
        whatClass: [
          {
            required: true,
            message: "请选择班级",
            trigger: "blur"
          }
        ],
        regionIds: [
          {
            required: true,
            message: "请选择区域",
            trigger: "blur"
          }
        ],
        terminalSchoolId: [
          {
            required: true,
            message: "请选择学校名称",
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
        ]
      },
      schoolList: [],
      params: []
    };
  },
  computed: {
    ...mapGetters(["schoolId"])
  },

  methods: {
    getIndex: function(event) {
      this.classIndex = event;
    },
    getClassId: function(e) {
      this.ClassId = this.schoolgradeName[this.classIndex].classes[e].classId;
      console.log(this.ClassId);
    },
    BeginFocus() {
      let endTimes = this.$refs.endTime.value;
      let startTimes = this.$refs.startTime.value;
      if (endTimes) {
        if (startTimes >= endTimes) {
          alert("区间范围不正确");
        }
      }
    },
    endFocus() {
      let endTimes = this.$refs.endTime.value;
      let startTimes = this.$refs.startTime.value;
      if (startTimes >= endTimes) {
        alert("区间范围不正确");
      }
    },
    // 考勤导出
    async punchTableBtn(schoolId, index) {
      let data = {
        schoolId: schoolId
      };
      this.attendanceSheet = true;
      let res = await service.querySchoolGrade(data, {
        headers: { "Content-Type": "application/json" }
      });
      if (res.errorCode === 0) {
        this.schoolgradeName = res.data;
        this.schoolgradeName[0].classes;
      }
    },
    // 考勤导出
    onSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let startTimes = this.$refs.startTime.value;
          let endTimes = this.$refs.endTime.value;
          if (startTimes >= endTimes) {
            alert("区间范围不正确");
          } else {
            let setStartTimes = new Date(startTimes);
            let y = setStartTimes.getFullYear();
            let MM = setStartTimes.getMonth() + 1;
            MM = MM < 10 ? "0" + MM : MM;
            let d = setStartTimes.getDate();
            d = d < 10 ? "0" + d : d;
            let h = setStartTimes.getHours();
            h = h < 10 ? "0" + h : h;
            let m = setStartTimes.getMinutes();
            m = m < 10 ? "0" + m : m;
            let s = setStartTimes.getSeconds();
            s = s < 10 ? "0" + s : s;
            var setStart = y + "-" + MM + "-" + d + " " + h + ":" + m + ":" + s;
            let date = new Date(endTimes);
            let yy = date.getFullYear();
            let MMM = date.getMonth() + 1;
            MMM = MMM < 10 ? "0" + MMM : MMM;
            let dd = date.getDate();
            dd = dd < 10 ? "0" + dd : dd;
            let hh = date.getHours();
            hh = hh < 10 ? "0" + hh : hh;
            let mm = date.getMinutes();
            mm = mm < 10 ? "0" + mm : mm;
            let ss = date.getSeconds();
            ss = ss < 10 ? "0" + ss : ss;
            var setEnd =
              yy + "-" + MMM + "-" + dd + " " + hh + ":" + mm + ":" + ss;

            let formObj = {
              classId: this.ClassId,
              startTime: setStart,
              endTime: setEnd,
              filePath: "C:/"
            };
            this.punchTable(formObj);
          }
        }
      });
    },

    async punchTable(params) {
      let res = await service.punchTable(params, {
        headers: { "Content-Type": "application/json" }
      });
      if (res.errorCode === 0) {
        this.innerUrl = res.data.tablePath;
        window.open(this.innerUrl);
      }
    },

    handleCurrentChange(curr) {
      this.query.page = curr;
    },
    handleSizeChange(size) {
      this.query.pageSize = size;
    },
    handleSearch() {
      this.querySchoolList(this.query);
    },
    handleChangeSchool(value) {
      let obj = this.schoolList.find(item => item.id === value);
      this.form.schoolName = obj.name;
    },
    handleAdd() {
      this.isShow = true;
      this.dialogFormVisible = true;
      this.form = {
        regionIds: []
      };
    },
    async handleEdit(row) {
      let { property, location, leaderName, regionId, ...args } = row;
      let regArray = [];
      let res = await service.findRegion({ regionId });
      if (res.errorCode === 0) {
        this.isShow = false;
        this.dialogFormVisible = true;
        for (let i in res.data) {
          regArray.push(res.data[i]);
        }
        this.form = Object.assign({}, args, { regionIds: regArray });
      }
    },

    //班级管理 老师管理 学生管理
    handleOpen(schoolId, index) {
      if (index == 1) {
        this.$router.push({
          path: `/weixin/class/${schoolId}`
        });
      } else if (index == 2) {
        this.$router.push({
          path: `/weixin/teacher/${schoolId}`
        });
      } else if (index == 3) {
        this.$router.push({
          path: `/weixin/student/${schoolId}`
        });
      } else if (index === 4) {
        this.$router.push({
          path: `/weixin/comment/${schoolId}`
        });
      } else if (index === 5) {
        this.$router.push({
          path: `/weixin/score/${schoolId}`
        });
      } else {
        this.$router.push({
          path: `/weixin/schedule/${schoolId}`
        });
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let { regionId, ...args } = this.form;
          if (this.isShow) {
            this.addLeaderInit(args);
          } else {
            this.updateSchool(args);
          }
        }
      });
    },
    //加载学校数据
    async queryRegion(value) {
      this.form.regionIds = value;
      let last = value[value.length - 1];
      let res = await service.queryRegion({ queryId: last, queryType: 3 });
      if (res.errorCode === 0) {
        this.schoolList = res.data;
      } else {
        return false;
      }
    },
    //查询学校列表（微信端）
    async querySchoolList(params = {}) {
      let res = await service.querySchoolList(params, {
        headers: { "Content-Type": "application/json" }
      });
      if (res.errorCode === 0) {
        this.tableData = res.data.data;
        this.totalCount = res.data.totalCount;
      }
    },
    //预录入号码（微信端）
    async addLeaderInit(params = {}) {
      let res = await service.addLeaderInit(params, {
        headers: { "Content-Type": "application/json" }
      });
      if (res.errorCode === 0) {
        this.dialogFormVisible = false;
        this.$refs.form.resetFields();
        this.querySchoolList(this.query);
      } else {
        this.$message({ message: `${res.errorMsg}`, type: "warning" });
      }
    },
    //编辑学校（微信端）
    async updateSchool(params = {}) {
      let res = await service.updateSchool(params, {
        headers: { "Content-Type": "application/json" }
      });
      if (res.errorCode === 0) {
        this.dialogFormVisible = false;
        this.$refs.form.resetFields();
        this.querySchoolList(this.query);
      }
    },
    //根据区域ID查询省市
    async findRegion(regionId) {
      let res = await service.findRegion({ regionId });
      if (res.errorCode === 0) {
        let regArray = [];
        for (let i in res.data) {
          regArray.push(res.data[i]);
        }
      }
    }
  },
  mounted() {
    this.querySchoolList(this.query);
  }
};
</script>
<style lang="less" scoped>
.derive_box {
  .derive {
    font-size: 18px;
    margin-top: -43px;
  }
  .el-dialog {
    .el-form-item {
      width: 100%;
      text-align: center;
      margin-top: 20px;
    }
  }
}
</style>
