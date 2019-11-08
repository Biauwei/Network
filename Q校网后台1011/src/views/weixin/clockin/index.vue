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
          <el-form-item label="学校名称">
            <el-input v-model="query.schoolName"></el-input>
          </el-form-item>

          <el-form-item label="学生姓名">
            <el-input v-model="query.studentName"></el-input>
          </el-form-item>
          <el-form-item label="类别">
            <el-select v-model="query.punchType" placeholder="全部">
              <el-option label="全部" value="全部"></el-option>
              <el-option label="NFC" value="0"></el-option>
              <el-option label="lbeacon" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="编号">
            <el-input v-model="query.no"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-search" type="primary" @click="handleSearch">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="page-bd">
      <!-- 表格数据 -->
      <base-table :data="tableData" :columns="columns">
        <!-- <el-table-column label="操作" width="400">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger">删除</el-button>
          </template>
        </el-table-column>-->
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
  </div>
</template>
<script>
import service from "@/api";
import region from "@/components/region";
import regiont from "@/components/qxregion";
import { isMac, isPhone } from "@/utils/validator";
import { mapGetters } from "vuex";
import QTable from "@/components/QTable";
import pageMixins from "@/mixins/page";

export default {
  name: "clockin",
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
      value1: new Date(),
      value2: new Date(),
      columns: [
        {
          label: "学校名称",
          prop: "schoolName"
        },
        {
          label: "类别",
          prop: "punchType"
        },
        {
          label: "学生姓名",
          prop: "studentName"
        },
        {
          label: "编号",
          prop: "no"
        },
        {
          label: "MAC",
          prop: "mac"
        },
        { label: "时间", prop: "postTime" }
      ],
      selected: "",
      form: {
        regionId: [],
        labelIds: []
      },
      punchType2: "",
      //默认参数
      query: {
        schoolName: "",
        studentName: "",
        no: "",
        punchType: "全部",
        scopeType: this.$store.getters.scopeType,
        scopeId: this.$store.getters.scopeId
      },
      //分页
      schoolId: null,
      //学校名称
      schoolList: [],
      //请求的数据
      labelsList: []
    };
  },
  computed: {
    ...mapGetters(["scopeType"])
  },
  methods: {
    handleCurrentChange(curr) {
      this.query.page = curr;
      this.queryPunchList();
    },
    handleSizeChange(size) {
      this.query.pageSize = size;
      this.queryPunchList();
    },
    //搜索
    handleSearch() {
      this.queryPunchList();
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
    handleAdd() {
      this.isShow = true;
      this.dialogFormVisible = true;
      this.form = {
        regionId: [],
        labelIds: []
      };
    },
    handleEdit(row) {
      this.isShow = false;
      this.dialogFormVisible = true;
      this.form = Object.assign({}, row);
      this.queryProvinceCityRegionBySchoolId(row.schoolId);
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.isShow) {
            let { regionId, ...args } = this.form;
            this.addDeviceBind(args);
          } else {
            let { postTime, schoolName, ...args } = this.form;
            this.updateDeviceBind(args);
          }
        }
      });
    },
    //加载学校数据
    // async queryRegion(value) {
    //   this.form.regionId = value;
    //   let last = value[value.length - 1];
    //   let res = await service.queryRegion({ queryId: last, queryType: 3 });
    //   if (res.errorCode === 0) {
    //     this.schoolList = res.data;
    //   } else {
    //     return false;
    //   }
    // },
    // //根据学校Id查询区域
    // async queryProvinceCityRegionBySchoolId(schoolId) {
    //   let res = await service.queryProvinceCityRegionBySchoolId({ schoolId });
    //   if (res.errorCode === 0) {
    //     let { province, city, region } = res.data[0];
    //     this.selected = `${province} / ${city} / ${region}`;
    //   }
    // },
    //查询标签
    async queryLabel() {
      let res = await service.queryLabel({ queryType: 3 });
      if (res.errorCode === 0) {
        this.labelsList = res.data;
      }
    },
    //显示设备列表
    async queryPunchList() {
      if (this.query.punchType == "全部") {
        this.punchType2 = 9;
        let arr = {
          studentName: this.query.studentName,
          schoolName: this.query.schoolName,
          number: this.query.no,
          type: this.punchType2,
          page: this.query.page,
          pageSize: this.query.pageSize
        };
        let res = await service.queryPunchList(arr);
        if (res.errorCode === 0) {
          this.tableData = res.data.data;
          this.totalCount = res.data.totalCount;
        }
      } else {
        let arr = {
          studentName: this.query.studentName,
          schoolName: this.query.schoolName,
          number: this.query.no,
          type: this.query.punchType,
          page: this.query.page,
          pageSize: this.query.pageSize
        };
        let res = await service.queryPunchList(arr);
        if (res.errorCode === 0) {
          this.tableData = res.data.data;
          this.totalCount = res.data.totalCount;
        }
      }
    }
  },
  mounted() {
    this.queryLabel();
    this.queryPunchList();
  }
};
</script>
<style lang="less" scoped>
.upload-demo {
  float: left;
  margin-right: 3px;
}
.el-form-item__content {
  width: 120px;
  .el-input {
    width: 120px;
  }
}
.el-select {
  width: 120px;
}
</style>
