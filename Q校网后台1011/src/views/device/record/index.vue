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
          <el-form-item label="区域选择">
            <qx-region-t @regionChange="handleRegionChange" :scopeType.sync="scopeType"></qx-region-t>
          </el-form-item>
          <el-form-item label="学校名称">
            <el-input v-model="query.schoolName" placeholder="请输入学校名称"></el-input>
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
      <base-table :data="tableData" :columns="columns">
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDel(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </base-table>
    </div>
    <div class="page-ft">
      <!-- 分页 -->
      <template>
        <div class="qx-pagination" v-if="totalCount">
          <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="query.page"
            :page-size="query.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalCount"
          ></el-pagination>
        </div>
      </template>
    </div>
    <!-- 新增 or 编辑检修记录 -->
    <template>
      <el-dialog top="40px" :visible.sync="dialogFormVisible" @close="close">
        <span slot="title" class="dialog-title">{{ isShow ? '新增': '编辑' }}</span>
        <el-form ref="formRef" :model="form" status-icon size="small" :label-width="formLabelWidth">
          <template v-if="isShow">
            <el-form-item
              label="区域选择"
              prop="regionId"
              :rules="[
              { required: true, message: '请选择区域', trigger: 'blur' }
            ]"
            >
              <qx-region @last="queryRegion" v-model="form.regionId"></qx-region>
            </el-form-item>
            <el-form-item
              label="学校名称"
              prop="schoolId"
              :rules="[
              { required: true, message: '请输入学校名称', trigger: 'blur' }
            ]"
            >
              <el-select v-model="form.schoolId" clearable filterable placeholder="选择学校">
                <el-option
                  v-for="item in schoolListInner"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </template>
          <el-form-item
            label="故障时间"
            prop="faultTime"
            :rules="[
            { required: true, message: '请选择故障时间', trigger: 'blur' }
          ]"
          >
            <el-date-picker
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              v-model="form.faultTime"
              type="datetime"
              placeholder="选择故障时间"
            ></el-date-picker>
          </el-form-item>
          <el-form-item
            label="检修时间"
            prop="repairTime"
            :rules="[
            { required: true, message: '请选择检修时间', trigger: 'blur' }
          ]"
          >
            <el-date-picker
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              v-model="form.repairTime"
              type="datetime"
              placeholder="选择检修时间"
            ></el-date-picker>
          </el-form-item>
          <el-form-item
            label="故障描述"
            prop="faultDescription"
            :rules="[
            { required: true, message: '请输入故障描述', trigger: 'blur' }
          ]"
          >
            <el-input
              type="textarea"
              v-model="form.faultDescription"
              :rows="5"
              placeholder="请输入故障描述"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="检修结果"
            prop="repairResult"
            :rules="[
            { required: true, message: '请输入检修结果', trigger: 'blur' }
          ]"
          >
            <el-input type="textarea" v-model="form.repairResult" :rows="5" placeholder="请输入检修结果"></el-input>
          </el-form-item>
          <el-form-item
            label="检修人员"
            prop="repairMan"
            :rules="[
            { required: true, message: '请输入检修人员', trigger: 'blur' }
          ]"
          >
            <el-input v-model="form.repairMan" placeholder="请输入检修人员" maxlength="4"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="handleCancle('formRef')">取消</el-button>
          <el-button size="small" type="primary" @click="formAction('formRef')">确定</el-button>
        </span>
      </el-dialog>
    </template>
  </div>
</template>
<script>
import service from "@/api";
import region from "@/components/region";
import regiont from "@/components/qxregion";
import { mapGetters } from "vuex";
import QTable from "@/components/QTable";
import pageMixins from "@/mixins/page";
export default {
  name: "record",
  components: {
    "qx-region": region,
    "qx-region-t": regiont,
    "base-table": QTable
  },
  mixins: [pageMixins],
  data() {
    return {
      columns: [
        {
          label: "序号",
          prop: "repairId"
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
          label: "安装位置",
          prop: "address"
        },
        {
          label: "故障时间",
          prop: "faultTime"
        },
        {
          label: "故障描述",
          prop: "faultDescription"
        },
        {
          label: "检修时间",
          prop: "repairTime"
        },
        {
          label: "检修结果",
          prop: "repairResult"
        },
        {
          label: "检修人员",
          prop: "repairMan"
        }
      ],
      //默认参数
      query: {
        schoolName: "",
        scopeType: this.$store.getters.scopeType,
        scopeId: this.$store.getters.scopeId
      },
      schoolId: null,
      //学校名称
      schoolList: [],
      schoolListInner: [],
      form: {
        regionId: []
      }
    };
  },
  computed: {
    ...mapGetters(["scopeType"])
  },
  methods: {
    handleCurrentChange(curr) {
      this.query.page = curr;
      this.showRepairList();
    },
    handleSizeChange(size) {
      this.query.pageSize = size;
      this.showRepairList();
    },
    close() {
      this.resetForm("formRef");
    },
    //搜索
    handleSearch() {
      this.showRepairList();
    },
    handleRegionChange(queryId, queryType) {
      this.query.scopeId = queryId;
      this.query.scopeType = queryType;
    },
    handleCancle(formName) {
      this.dialogFormVisible = false;
    },
    handleAdd() {
      this.isShow = true;
      this.dialogFormVisible = true;
      this.form = {};
    },
    handleEdit(row) {
      let { address, deviceId, deviceNo, schoolName, ...args } = row;
      this.isShow = false;
      this.dialogFormVisible = true;
      this.form = Object.assign({}, args);
    },
    handleDel(row) {
      let that = this;
      this.$confirm(`确定删除吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          that.deleteDeviceRepair(row.repairId);
        })
        .catch(error => {
          return false;
        });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    formAction(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let { regionId, schoolId, ...args } = this.form;
          if (schoolId && this.isShow) {
            //新增
            let obj = Object.assign({}, args, { schoolId });
            this.addDeviceRepair(obj);
          } else {
            this.updateDeviceRepair(this.form);
          }
        }
      });
    },
    //获取学校
    async queryRegion(value) {
      this.form.regionId = value;
      let last = value[value.length - 1];
      let res = await service.queryRegion({ queryId: last, queryType: 3 });
      if (res.errorCode === 0) {
        if (this.isShow) {
          this.schoolListInner = res.data;
        } else {
          this.schoolList = res.data;
        }
      } else {
        return false;
      }
    },
    //显示检修列表
    async showRepairList() {
      let res = await service.showRepairList(this.query);
      if (res.errorCode === 0) {
        this.tableData = res.data.data;
        this.totalCount = res.data.totalCount;
      }
    },
    //新增检修记录
    async addDeviceRepair(params = {}) {
      let res = await service.addDeviceRepair(params);
      if (res.errorCode === 0) {
        this.dialogFormVisible = false;
        this.showRepairList(this.query);
        this.$refs.formRef.resetFields();
      } else {
        this.dialogFormVisible = false;
        this.$message({ message: `${res.errorMsg}`, type: "error" });
      }
    },
    //编辑检修记录
    async updateDeviceRepair(params = {}) {
      let res = await service.updateDeviceRepair(params);
      if (res.errorCode === 0) {
        this.dialogFormVisible = false;
        this.showRepairList(this.query);
      }
    },
    //删除检修记录
    async deleteDeviceRepair(repairId) {
      let res = await service.deleteDeviceRepair({ repairId });
      if (res.errorCode === 0) {
        this.query.page = 1; //从第一页开始查起
        this.showRepairList(this.query);
      }
    }
  },
  mounted() {
    this.showRepairList();
  }
};
</script>
<style lang="less" scoped>
</style>
