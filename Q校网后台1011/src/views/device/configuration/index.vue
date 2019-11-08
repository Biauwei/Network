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
          <el-form-item label="设备编号">
            <el-input v-model="query.deviceNo" placeholder="请输入设备编号"></el-input>
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
      <el-table :data="tableData" style="width: 100%">
        <el-table-column type="index" label="序号" width="200"></el-table-column>
        <el-table-column prop="schoolName" label="学校名称"></el-table-column>
        <el-table-column prop="deviceNo" label="设备编号"></el-table-column>
        <el-table-column prop="apMac" label="设备MAC"></el-table-column>
        <el-table-column prop="postTime" label="配置时间"></el-table-column>
        <el-table-column prop="type" label="节点类型"></el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDel(scope.row)">删除</el-button>
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
    <!-- 新增 or 编辑 -->
    <template>
      <el-dialog top="40px" :visible.sync="dialogFormVisible" @close="handleDialogClose">
        <span slot="title" class="dialog-title">{{ isShow ? '新增': '编辑' }}</span>
        <el-form
          :rules="rules"
          ref="form"
          :model="form"
          status-icon
          size="small"
          :label-width="formLabelWidth"
        >
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
              <el-select
                @change="getCarModel()"
                v-model="form.schoolId"
                clearable
                placeholder="请选择学校"
              >
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
          <template>
            <el-form-item label="班牌编号" prop="deviceNo">
              <el-select v-model="form.deviceNo" placeholder="请输入班牌编号">
                <el-option
                  v-for="item in deviceBack"
                  :key="item.deviceNo"
                  :label="item.deviceNo"
                  :value="item.deviceNo"
                ></el-option>
              </el-select>
            </el-form-item>
          </template>
          <el-form-item label="设备MAC" prop="apMac">
            <el-input v-model="form.apMac" ref="deviceMac" placeholder="请输入设备MAC" maxlength="30"></el-input>
          </el-form-item>
          <!-- 节点选择 -->
          <el-form-item label="节点选择" prop="type">
            <el-radio-group v-model="form.type">
              <el-radio :label="1">1</el-radio>
              <el-radio :label="2">2</el-radio>
            </el-radio-group>
          </el-form-item>
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
import qs from "qs";
export default {
  name: "configuration",
  components: {
    "qx-region": region,
    "qx-region-t": regiont,
    "base-table": QTable
  },
  mixins: [pageMixins],
  data() {
    return {
      // 单选节点
      radio: 3,
      deviceNo: "",
      deviceBack: "",
      selected: "",
      form: {
        regionId: [],
        labelIds: []
      },
      rules: {
        regionId: [
          {
            required: true,
            message: "请选择区域",
            trigger: "blur"
          }
        ],
        schoolId: [
          {
            required: true,
            message: "请选择学校名称",
            trigger: "blur"
          }
        ],
        apMac: [
          {
            required: true,
            message: "请输入设备MAC",
            trigger: "blur"
          }
        ],
        deviceNo: [
          {
            required: true,
            message: "请输入班牌编号",
            trigger: "blur"
          }
        ],
        type: [
          {
            required: true,
            message: "请选择系统类型",
            trigger: "blur"
          }
        ]
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
      labelsList: []
    };
  },
  computed: {
    ...mapGetters(["scopeType"])
  },
  methods: {
    // 分页
    handleCurrentChange(curr) {
      this.query.page = curr;
      this.deviceApList();
    },
    // 分页
    handleSizeChange(size) {
      this.query.pageSize = size;
      this.deviceApList();
    },
    //搜索查询
    handleSearch() {
      this.deviceApList();
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

    // 编辑
    handleEdit(row) {
      this.isShow = false;
      this.dialogFormVisible = true;
      this.form = Object.assign({}, row);
      let data = {
        deviceNo: row.deviceNo,
        apMac: row.apMac,
        schoolId: row.schoolId
      };

      this.deviceNo = row.deviceNo;
      this.deviceMac = row.apMac;
      this.queryApInfo(data);
      this.queryProvinceCityRegionBySchoolId(row.schoolId);
    },
    //设备ap详情查询(编辑)
    async queryApInfo(params) {
      let res = await service.queryApInfo(params);
      if (res.errorCode === 0) {
      }
    },
    //编辑设备绑定
    async updateDeviceAp(params) {
      let res = await service.updateDeviceAp(params);
      if (res.errorCode === 0) {
        this.dialogFormVisible = false;
        this.deviceApList();
      }
    },

    // 删除
    handleDel(row) {
      this.$confirm(`确定删除吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.deleteDeviceAp(row.apMac);
        })
        .catch(error => {
          return false;
        });
    },

    // 获取学校下拉菜单的id值
    getCarModel(formName) {
      this.querySchoolDevice();
    },

    async querySchoolDevice(schoolId) {
      if (this.isShow) {
        let uploadForm = new FormData();
        uploadForm.append("schoolId", this.form.schoolId);

        let config = {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        };
        let res = await service.querySchoolDevice(uploadForm, config);
        this.deviceBack = res.data;
      } else {
        let uploadForm = new FormData();
        uploadForm.append("schoolId", this.form.schoolId);
        let config = {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        };
        let res = await service.querySchoolDevice(uploadForm, config);
        let data = {
          type: this.form.type,
          id: this.form.id,
          deviceMac: res.data[0].deviceMac,
          apMac: this.$refs.deviceMac.value
        };
        this.updateDeviceAp(data);
      }
    },

    // 提交增加/编辑按钮
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.isShow) {
            this.$confirm(`确定添加吗?`, "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            })
              .then(() => {
                this.deviceBindingAp();
              })
              .catch(error => {
                return false;
              });
          } else {
            this.$confirm(`确定提交吗?`, "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            })
              .then(() => {
                this.querySchoolDevice();
              })
              .catch(error => {
                return false;
              });
          }
        }
      });
    },
    //新增设备绑定
    async deviceBindingAp(schoolId) {
      let BindingApForm = new FormData();
      BindingApForm.append("deviceMac", this.deviceBack[0].deviceMac);
      BindingApForm.append("apMac", this.form.apMac);
      BindingApForm.append("type", this.form.type);
      let config = {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      };
      let res = await service.deviceBindingAp(BindingApForm, config);
      if (res.errorCode === 0) {
        this.queryLabel();
        this.deviceApList();
        this.$message({
          message: "绑定成功",
          type: "warning"
        });
        this.dialogFormVisible = false;
      } else {
        this.$message({
          message: res.errorMsg,
          type: "warning"
        });
      }
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
    async deviceApList() {
      let res = await service.deviceApList(this.query);
      if (res.errorCode === 0) {
        this.tableData = res.data.data;
        this.totalCount = res.data.totalCount;
      }
    },

    //删除设备绑定
    async deleteDeviceAp(apMac) {
      let res = await service.deleteDeviceAp({ apMac });
      if (res.errorCode === 0) {
        this.deviceApList();
      }
    }
  },
  mounted() {
    this.queryLabel();
    this.deviceApList();
  }
};
</script>
<style lang="less" scoped>
.page {
  .el-input--small {
    width: 215px !important;
    .el-input__inner {
      width: 215px !important;
    }
  }
  .el-form-item__label {
    text-align: center !important;
  }
}
</style>
