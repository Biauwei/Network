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

          <el-form-item label="状态">
            <el-select v-model="query.online" placeholder="全部">
              <el-option label="离线" value="shanghai"></el-option>
              <el-option label="在线" value="beijing"></el-option>
            </el-select>
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
        <el-table-column label="控制" width="400">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="handleEdit(scope.row)">设置开/关机时间</el-button>
            <el-button size="mini" type="danger">重启</el-button>
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
            <el-form-item label="学校名称" prop="schoolId">
              <el-select v-model="form.schoolId" clearable placeholder="请选择学校">
                <el-option
                  v-for="item in schoolList"
                  :key="item.id"
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

          <el-form-item label="开机时间">
            <el-time-select
              v-model="powerOnTime"
              :picker-options="{
              start: '00:00',
              step: '00:01',
              end: '23:59',
              }"
            ></el-time-select>
          </el-form-item>
          <el-form-item label="关机时间">
            <el-time-select
              v-model="powerOffTime"
              :picker-options="{
              start: '00:00',
              step: '00:01',
              end: '23:59',
              }"
            >></el-time-select>
          </el-form-item>
          <el-checkbox-group v-model="checkedweek" :min="1" :max="7" @checked="cheBtn(week)">
            <el-checkbox v-for="week in cities" :label="week" :key="week">{{week}}</el-checkbox>
          </el-checkbox-group>
        </el-form>

        <!-- 取消提交按钮 -->
        <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="dialogFormVisible = false">取消</el-button>
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
const weekOptions = [
  "星期一",
  "星期二",
  "星期三",
  "星期四",
  "星期五",
  "星期六",
  "星期日"
];
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
      checkedweek: [],
      cities: weekOptions,
      weekDays: [],
      checked: false,
      powerOnTime: "",
      powerOffTime: "",
      checkList: [],

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
      form: {
        regionId: [],
        labelIds: []
      },
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
      weekday: ""
    };
  },
  computed: {
    ...mapGetters(["scopeType"]),
    cheBtn(week) {
      console.log(week);
    }
  },
  methods: {
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

    // 批量设置开关时间--wei
    handleAdd() {
      this.isShow = true;
      this.dialogFormVisible = true;
      this.form = {
        regionId: [],
        labelIds: []
      };
    },

    // 查询设备开关时间--wei
    handleEdit(row) {
      this.isShow = false;
      this.dialogFormVisible = true;
      this.form = Object.assign({}, row);
      this.queryProvinceCityRegionBySchoolId(row.schoolId);
      let mac = this.form.mac;
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
            // 批量设置时间
            let { regionId, ...args } = this.form;
            this.addDeviceBind(args);
            console.log(1);
          } else {
            // 设置班牌开/关时间
            // console.log(this.form);
            // this.deviceOnAndOff(uploadForm, config);
            console.log(this.checkedweek);
          }
        }
      });
    },
    //加载学校数据
    async queryRegion(value) {
      this.form.regionId = value;
      let last = value[value.length - 1];
      let res = await service.queryRegion({ queryId: last, queryType: 3 });
      if (res.errorCode === 0) {
        this.schoolList = res.data;
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

    //新增设备绑定
    async addDeviceBind(params = {}) {
      let res = await service.addDeviceBind(params);
      if (res.errorCode === 0) {
        this.dialogFormVisible = false;
        this.$refs.form.resetFields();
        this.queryClassCardList();
      } else if (res.errorCode === -1) {
        //MAC码已存在
        this.$message({ message: `${res.errorMsg}`, type: "warning" });
        return false;
      }
    },
    //查询开关机时间
    async deviceOnAndOff(params = {}) {
      let res = await service.deviceOnAndOff(params);
      if (res.errorCode === 0) {
        this.powerOnTime = res.data.powerOnTime;
        this.powerOffTime = res.data.powerOffTime;
        // this.queryClassCardList();
        console.log(this.powerOnTime);
        this.weekDays = res.data.weekDays;
      }
    },

    //删除设备绑定
    async deleteDeviceBind(deviceId) {
      let res = await service.deleteDeviceBind({ deviceId });
      if (res.errorCode === 0) {
        this.queryClassCardList();
      }
    }
  },
  mounted() {
    this.queryLabel();
    this.queryClassCardList();
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
