<template>
  <div class="page">
    <div class="page-hd">
      <!-- 表单 -->
      <div class="page-form">
        <el-form
          class="demo-form-inline"
          :inline="true"
          :model="query"
          size="small"
          label-width="70px"
          label-position="left"
        >
          <el-form-item label="区域选择">
            <qx-region-t @regionChange="handleRegionChange" :scopeType.sync="scopeType"></qx-region-t>
          </el-form-item>
          <el-form-item label="学校名称">
            <el-input v-model="query.schoolName" placeholder="请输入学校名称"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button icon="el-icon-search" type="primary" @click="handleSearch">查询</el-button>
            <el-button icon="el-icon-plus" type="primary" @click="handleAdd">批量设置开关机</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="page-bd">
      <!-- 表格数据 -->
      <base-table :data="tableData" :columns="columns">
        <el-table-column label="控制" width="300">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="handleEdit(scope.row)">设置开/关机时间</el-button>
            <!-- <el-button size="mini" type="danger">重启</el-button> -->
          </template>
        </el-table-column>
      </base-table>
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
    <!-- 新增 or 编辑 -->
    <template>
      <el-dialog top="40px" :visible.sync="dialogFormVisible" @close="handleDialogClose">
        <span slot="title" class="dialog-title">{{ isShow ? '批量设置开关时间': '设置开/关时间' }}</span>

        <el-form ref="form" :model="form" status-icon size="small" :label-width="formLabelWidth">
          <template v-if="isShow">
            <el-form-item label="选择区域" prop="regionId">
              <qx-region @last="queryRegion" v-model="form.regionId"></qx-region>
            </el-form-item>
          </template>
          <template v-else>
            <el-form-item label="区域选择">
              <el-input v-model="selected" disabled></el-input>
            </el-form-item>
          </template>
          <template v-if="isShow">
            <el-form-item label="学校名称" prop="schoolName">
              <el-select @change="schoolType" v-model="form.schoolName" placeholder="请选择学校">
                <el-option
                  v-for="(item,idx) in schoolList"
                  :key="idx"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </template>
          <template v-else>
            <el-form-item label="学校名称">
              <el-input v-model="form.schoolName" disabled></el-input>
            </el-form-item>
          </template>

          <el-form-item label="开机时间" v-if="isShow">
            <el-time-select
              v-model="form.bacthPowerOnTime"
              :picker-options="{
              start: '00:00',
              step: '00:01',
              end: '23:59',
              }"
            ></el-time-select>
          </el-form-item>
          <el-form-item label="开机时间" v-else>
            <el-time-select
              v-model="form2.powerOnTime"
              :picker-options="{
              start: '00:00',
              step: '00:01',
              end: '23:59',
              }"
            ></el-time-select>
          </el-form-item>
          <el-form-item label="关机时间" v-if="isShow">
            <el-time-select
              v-model="form.bacthPowerOffTime"
              :picker-options="{
              start: '00:00',
              step: '00:01',
              end: '23:59',
              }"
            >></el-time-select>
          </el-form-item>
          <el-form-item label="关机时间" v-else>
            <el-time-select
              v-model="form2.powerOffTime"
              :picker-options="{
              start: '00:00',
              step: '00:01',
              end: '23:59',
              }"
            >></el-time-select>
          </el-form-item>
          <el-checkbox-group v-if="isShow" v-model="form.bacthCheck">
            <el-checkbox
              v-for="(item,index) in options"
              :label="item.label"
              :key="index"
              @change="bacthCheckedStatus(index)"
            ></el-checkbox>
          </el-checkbox-group>
          <el-checkbox-group v-model="checkedweek" v-else>
            <el-checkbox
              @change="checkedStatus(idx)"
              v-for="(week,idx) in cities"
              :label="week.label"
              :key="idx"
            ></el-checkbox>
          </el-checkbox-group>
        </el-form>
        <!-- 取消提交按钮 -->
        <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="cancel">取消</el-button>
          <el-button size="small" type="primary" @click="submitForm('form')">确定</el-button>
        </span>
      </el-dialog>
    </template>
  </div>
</template>


<script>
// import service from "@/api";
import service from "@/api";
import region from "@/components/region";
import regiont from "@/components/qxregion";
import { isMac, isPhone } from "@/utils/validator";
import { mapGetters } from "vuex";
import QTable from "@/components/QTable";
import pageMixins from "@/mixins/page";
import axios from "axios";
import qs from "qs";

export default {
  name: "control",
  components: {
    "qx-region": region,
    "qx-region-t": regiont,
    "base-table": QTable
  },
  mixins: [pageMixins],
  data() {
    return {
      formInline: {
        region: ""
      },

      chcthCheckedList: "",
      options: [
        { label: "星期一", day: "1", status: 0 },
        { label: "星期二", day: "2", status: 0 },
        { label: "星期三", day: "3", status: 0 },
        { label: "星期四", day: "4", status: 0 },
        { label: "星期五", day: "5", status: 0 },
        { label: "星期六", day: "6", status: 0 },
        { label: "星期日", day: "7", status: 0 }
      ],
      checkedweek: [],
      cn: ["一", "二", "三", "四", "五", "六", "日"],
      cities: [],
      weekDays: [],

      checkList: [],
      checkedList: [],
      OnTime: "",
      columns: [
        {
          label: "序号",
          prop: "deviceId"
        },
        {
          label: "学校名称",
          prop: "schoolName"
        },
        {
          label: "设备编号",
          prop: "deviceNo"
        },
        {
          label: "MAC地址",
          prop: "mac"
        }
      ],
      selected: "",
      checked2: false,
      form: {
        regionId: [],
        labelIds: [],
        bacthCheck: [],
        schoolName: [],
        bacthPowerOffTime: "",
        bacthPowerOnTime: ""
      },
      form2: {
        powerOnTime: "",
        powerOffTime: ""
      },

      inject: ["reload"],
      //默认参数
      query: {
        schoolName: "",
        scopeType: this.$store.getters.scopeType,
        scopeId: this.$store.getters.scopeId
      },
      //分页
      schoolId: null,
      //学校名称
      schoolList: [],
      //请求的数据
      labelsList: [],
      weekday: "",
      argsData: "",
      SelectSchool: ""
    };
  },
  computed: {
    ...mapGetters(["scopeType"])
  },
  mounted() {
    this.queryLabel();
    this.queryClassCardList();
  },
  beforeDestroy() {
    clearInterval(this.timer);
    this.timer = null;
  },

  methods: {
    cancel() {
      this.checkedweek = [];
      this.dialogFormVisible = false;
    },
    schoolType(e) {
      let obj = {};
      obj = this.schoolList.find(item => {
        return item.id === e;
      });
      this.SelectSchool = obj;
    },

    handleCurrentChange(curr) {
      this.query.page = curr;
      this.queryClassCardList();
    },
    handleSizeChange(size) {
      this.query.pageSize = size;
      this.queryClassCardList();
    },
    //搜索
    handleSearch() {
      this.queryClassCardList();
    },
    handleRegionChange(queryId, queryType) {
      this.query.scopeId = queryId;
      this.query.scopeType = queryType;
    },
    handleDialogClose() {
      this.$nextTick(() => {
        this.$refs.form.resetFields();
      });
    },

    // 批量设置(复选框选择)
    bacthCheckedStatus(index) {
      this.options[index].status == 0
        ? (this.options[index].status = "1")
        : (this.options[index].status = "0");
      let chcthDdta = this.options.map(item => {
        return {
          day: item.day,
          status: item.status
        };
      });
      this.chcthCheckedList = chcthDdta;
    },
    // 单个设置(复选框选择)
    checkedStatus(idx) {
      // console.log("checkedweek", this.checkedweek);
      this.cities[idx].status == "0"
        ? (this.cities[idx].status = "1")
        : (this.cities[idx].status = "0");
      let weekData = this.cities.map(item => {
        return {
          day: item.day,
          status: item.status
        };
      });
      this.checkedList = weekData;
    },

    handleAdd() {
      this.isShow = true;
      this.dialogFormVisible = true;
      this.form = {
        regionId: [],
        labelIds: [],
        schoolName: [],
        bacthCheck: [],
        bacthPowerOffTime: "",
        bacthPowerOnTime: ""
      };
    },

    // 查询设备开关时间
    handleEdit(row) {
      this.checkedweek = [];
      this.isShow = false;
      this.dialogFormVisible = true;
      this.form = Object.assign({}, row);
      this.queryProvinceCityRegionBySchoolId(row.schoolId);
      let {
        address,
        batch,
        channelTemplateId,
        deviceId,
        deviceNo,
        labelIds,
        manager,
        phone,
        postTime,
        type,
        schoolId,
        serial,
        schoolName,
        ...args
      } = this.form;
      this.deviceOnAndOff(args);
    },

    // 提交设置开关时间
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.isShow) {
            // 批量设置开/关机
            let SetUp = {
              schoolId: this.SelectSchool.id,
              powerOnTime: this.form.bacthPowerOnTime,
              powerOffTime: this.form.bacthPowerOffTime,
              weekDays: JSON.stringify(this.chcthCheckedList)
            };

            this.batchSetUp(SetUp);
          } else if (!this.isShow) {
            let data1 = {
              powerOnTime: this.form2.powerOnTime,
              powerOffTime: this.form2.powerOffTime,
              mac: this.form.mac,
              weekDays: JSON.stringify(this.checkedList)
            };
            this.saveOrUpdateCard(data1);
          }
        }
      });
    },
    // 批量设置开/关机
    async batchSetUp(params = {}) {
      let res = await service.batchSetUp(params);
      if (res.errorCode == 0) {
        this.$message({ message: "批量设置成功!", type: "warning" });
        const timer = setTimeout(() => {
          this.dialogFormVisible = false;
        }, 100);
      } else {
        this.$message({ message: "批量设置失败!", type: "warning" });
      }
    },
    // 单个设置开/关机
    async saveOrUpdateCard(params = {}) {
      let res = await service.saveOrUpdateCard(params);
      if (res.errorCode == 0) {
        this.$message({ message: "设置成功!", type: "warning" });
        const timer = setTimeout(() => {
          this.dialogFormVisible = false;
          // this.reload();
        }, 100);
      } else {
        this.$message({ message: "设置失败!", type: "warning" });
        // this.reload();
      }
    },
    //加载学校数据
    async queryRegion(value) {
      this.form.regionId = value;
      let last = value[value.length - 1];
      let res = await service.queryRegion({ queryId: last, queryType: 3 });
      if (res.errorCode === 0) {
        this.schoolList = res.data;
        console.log(this.schoolList);
      } else {
        return false;
      }
    },
    //根据学校Id查询区域
    async queryProvinceCityRegionBySchoolId(schoolId) {
      let res = await service.queryProvinceCityRegionBySchoolId({ schoolId });
      if (res.errorCode === 0) {
        let { province, city, region } = res.data[0];
        this.selected = `${province} / ${city} / ${region}`;
      }
    },
    //查询标签
    async queryLabel() {
      let res = await service.queryLabel({ queryType: 3 });
      if (res.errorCode === 0) {
        this.labelsList = res.data;
      }
    },
    //显示设备列表
    async queryClassCardList() {
      let res = await service.queryClassCardList(this.query);
      if (res.errorCode === 0) {
        this.tableData = res.data.data;
        this.totalCount = res.data.totalCount;
      }
    },

    //查询开关机时间
    async deviceOnAndOff(params = {}) {
      let res = await service.deviceOnAndOff(params);
      if (res.errorCode === 0) {
        this.form2.powerOnTime = res.data.powerOnTime;
        this.form2.powerOffTime = res.data.powerOffTime;
        let arr = res.data.weekDays;
        let arrList = arr.map((item, idx) => {
          return {
            day: item.day,
            status: item.status,
            label: "星期" + this.cn[idx]
          };
        });
        this.cities = arrList;
        // console.log(this.cities);
        for (let i = 0; i < arrList.length; i++) {
          if (arrList[i].status) {
            this.checkedweek.push(arrList[i].label);
          }
        }
      }
    }
  }
};
</script>
<style lang="less" scoped>
.radius {
  display: block;
  height: 12px;
  width: 12px;
  border-radius: 50%;
  background: green;
  float: left;
  margin-top: 5px;
}
.inOff {
  float: left;
  margin-left: 5px;
}
</style>
<style lang="less">
.el-checkbox__label {
  padding-left: 2px;
}
</style>
