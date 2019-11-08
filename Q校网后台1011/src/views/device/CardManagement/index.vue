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
          <el-form-item label="MAC">
            <el-input v-model="query.searchMAC" ref="searchMAC"></el-input>
          </el-form-item>
          <el-form-item label="NO">
            <el-input v-model="query.searchId" ref="searchId"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button icon="el-icon-search" type="primary" @click="handleSearch">查询</el-button>
            <!-- 文件导入 -->
            <el-upload
              class="upload-demo"
              ref="excel"
              list-type="text"
              :multiple="false"
              :with-credentials="true"
              :show-file-list="false"
              action
              accept=".xls"
              :before-upload="beforeUpload"
            >
              <el-button size="small" icon="el-icon-plus" type="primary">文件导入上传</el-button>
            </el-upload>
            <el-button icon="el-icon-plus" type="primary" @click="handleAdd">新增</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="page-bd">
      <!-- 表格数据 -->
      <el-table :data="tableData" style="width: 100%">
        <el-table-column type="index" label="序号" width="200"></el-table-column>
        <el-table-column prop="beaconMac" label="MAC"></el-table-column>
        <el-table-column prop="beaconId" label="NO"></el-table-column>
        <el-table-column label="操作">
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
          :current-page="currentPage"
          :page-size="pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalCount"
        ></el-pagination>
      </div>
    </div>
    <!-- 新增 or 编辑 -->
    <template>
      <el-dialog top="40px" :visible.sync="dialogFormVisible" @close="handleDialogClose">
        <span slot="title" class="dialog-title">{{ !idShow ? '新增': '编辑' }}</span>
        <el-form ref="form" :model="form" status-icon size="small" :label-width="formLabelWidth">
          <el-form-item label="序号" prop="id" v-if="idShow">
            <el-input v-model="form.id" disabled></el-input>
          </el-form-item>
          <el-form-item label="MAC" prop="mac">
            <el-input v-model="form.beaconMac" placeholder="请输入MAC"></el-input>
          </el-form-item>
          <el-form-item label="NO" prop="beaconMac">
            <el-input v-model="form.beaconId" placeholder="请输入ID"></el-input>
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
import service from "@/api";
import region from "@/components/region";
import regiont from "@/components/qxregion";
import { isMac, isPhone } from "@/utils/validator";
import { mapGetters } from "vuex";
import QTable from "@/components/QTable";
import pageMixins from "@/mixins/page";

export default {
  name: "CardManagement",
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
      idShow: false,
      value1: new Date(),
      value2: new Date(),
      selected: "",
      form: {
        regionId: [],
        labelIds: []
      },

      //默认参数
      query: {
        searchMAC: "",
        searchId: "",
        scopeType: this.$store.getters.scopeType,
        scopeId: this.$store.getters.scopeId
      },
      //分页
      schoolId: null,
      currentPage: 1,
      pagesize: 10,
      totalCount: ""
    };
  },
  computed: {
    ...mapGetters(["scopeType"])
  },
  methods: {
    // 文件导入上传
    async beforeUpload(file) {
      let fileName = [];
      fileName = file.name.split(".");
      const extension = fileName[fileName.length - 1] === "xls";
      if (!extension) {
        this.$message({
          message: "文件只能是xls格式!",
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
        // uploadForm.append("schoolId", schoolId);
        let res = await service.beaconBatch(uploadForm, config);
        if (res.errorCode === 0) {
          this.$alert("导入成功", "提示", {
            confirmButtonText: "确定",
            type: "success"
          });
          // this.queryTeachers(this.query);
          this.queryBeaconAll();
        }
      }
      return extension || extensions;
    },

    // 当前页数
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      this.queryBeaconAll();
    },
    // 每页多少条
    handleSizeChange(size) {
      this.pagesize = size;
      this.queryBeaconAll();
    },
    //搜索
    handleSearch() {
      this.queryBeaconAll();
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
    //新增按钮
    handleAdd() {
      this.idShow = false;
      this.dialogFormVisible = true;
      this.form = {
        regionId: [],
        labelIds: []
      };
    },

    //删除设备绑定
    handleDel(row) {
      this.$confirm(`确定删除吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.deleteBeaconALL(row);
        })
        .catch(error => {
          return false;
        });
    },
    async deleteBeaconALL(row) {
      let data = {
        id: row.id
      };
      let res = await service.deleteBeaconALL(data, {
        headers: { "Content-Type": "application/json" }
      });
      if (res.errorCode === 0) {
        // this.deleteBeaconALL(row);
        this.queryBeaconAll();
        this.$message({
          message: "删除成功",
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

    // 新增提交
    submitForm(formNFC) {
      if (this.form.id) {
        this.$confirm(`确定修改吗?`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.updateBeaconAll(this.form);
          })
          .catch(error => {
            return false;
          });
      } else {
        this.$confirm(`确定新增吗?`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.beaconAll(this.form);
          })
          .catch(error => {
            return false;
          });
      }
    },
    //新增设备绑定
    async beaconAll(formNFC) {
      let data = {
        beaconMac: formNFC.beaconMac,
        beaconId: formNFC.beaconId
      };
      let res = await service.beaconAll(data, {
        headers: { "Content-Type": "application/json" }
      });
      if (res.errorCode === 0) {
        this.queryBeaconAll();
        this.$message({
          message: "添加成功",
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

    // 编辑Beacon库
    handleEdit(row) {
      this.idShow = true;
      this.dialogFormVisible = true;
      this.form = Object.assign({}, row);
      // console.log(this.form);
    },
    //编辑设备绑定
    async updateBeaconAll(formNFC) {
      let data = {
        id: formNFC.id,
        beaconId: formNFC.beaconId,
        beaconMac: formNFC.beaconMac
      };
      let res = await service.updateBeaconAll(data, {
        headers: { "Content-Type": "application/json" }
      });
      if (res.errorCode === 0) {
        this.$message({
          message: "修改成功",
          type: "warning"
        });
        this.dialogFormVisible = false;
        this.queryBeaconAll();
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
    async queryBeaconAll() {
      let data = {
        page: this.currentPage,
        pageSize: this.pagesize,
        beaconId: this.query.searchId,
        mac: this.query.searchMAC
      };
      let res = await service.queryBeaconAll(data, {
        headers: { "Content-Type": "application/json" }
      });
      if (res.errorCode === 0) {
        this.tableData = res.data.data;
        this.totalCount = res.data.totalCount;
        console.log(this.tableData);
      }
    }
  },
  created() {
    this.queryLabel();
    this.queryBeaconAll();
  }
};
</script>
<style lang="less" scoped>
.upload-demo {
  float: right;
  margin-left: 4px;
}
.el-form-item__content {
  width: 150px;
  .el-input {
    width: 150px;
    text-align: center;
  }
}
.el-select {
  width: 150px;
}
</style>
<style lang="less">
.el-form-item--small {
  .el-form-item__label {
    text-align: center !important;
  }
}
</style>
