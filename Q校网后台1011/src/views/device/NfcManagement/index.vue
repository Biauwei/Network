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
          <el-form-item label="ID">
            <el-input v-model="query.searchNO" ref="searchNO"></el-input>
          </el-form-item>
          <el-form-item label="NO">
            <el-input v-model="query.searchID" ref="searchID"></el-input>
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
      <base-table :data="tableData" :columns="columns">
        <el-table-column label="操作" width="400">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDel(scope.row)">删除</el-button>
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
            <el-input v-model="form.id"></el-input>
          </el-form-item>
          <el-form-item label="ID">
            <el-input v-model="form.nfcId" placeholder="请输入ID"></el-input>
          </el-form-item>
          <el-form-item label="NO">
            <el-input v-model="form.nfcMac" placeholder="请输入NO"></el-input>
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
import ax from "axios";

export default {
  name: "NfcManagement",
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
      columns: [
        {
          label: "序号",
          prop: "id"
        },
        {
          label: "ID",
          prop: "nfcId"
        },
        {
          label: "NO",
          prop: "nfcMac"
        }
      ],
      selected: "",
      form: {
        regionId: [],
        labelIds: []
      },

      //默认参数
      query: {
        searchID: "",
        searchNO: "",
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
        let res = await service.nfcBatch(uploadForm, config);
        if (res.errorCode === 0) {
          this.$alert("导入成功", "提示", {
            confirmButtonText: "确定",
            type: "success"
          });
          // this.queryTeachers(this.query);
          this.queryNfcAll();
        }
      }
      return extension || extensions;
    },

    // 当前页数
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      this.queryNfcAll();
    },
    // 每页多少条
    handleSizeChange(size) {
      this.pagesize = size;
      this.queryNfcAll();
    },
    //搜索
    handleSearch() {
      this.queryNfcAll();
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
          this.deleteNfc(row);
        })
        .catch(error => {
          return false;
        });
    },
    async deleteNfc(row) {
      let data = {
        id: row.id
      };
      let res = await service.deleteNfc(data, {
        headers: { "Content-Type": "application/json" }
      });
      if (res.errorCode === 0) {
        this.queryNfcAll();
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
            this.updateNfc(this.form);
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
            this.addNfcAll(this.form);
          })
          .catch(error => {
            return false;
          });
      }
    },
    //新增设备绑定
    async addNfcAll(formNFC) {
      let data = {
        nfcMac: formNFC.nfcMac,
        nfcId: formNFC.nfcId * 1
      };
      console.log(data);
      let res = await service.addNfcAll(data, {
        headers: { "Content-Type": "application/json" }
      });
      if (res.errorCode === 0) {
        this.queryNfcAll();
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

    // 编辑nfc库
    handleEdit(row) {
      this.idShow = true;
      this.dialogFormVisible = true;
      this.form = Object.assign({}, row);
    },
    //编辑设备绑定
    async updateNfc(formNFC) {
      let data = {
        id: formNFC.id,
        nfcId: formNFC.nfcId,
        nfcMac: formNFC.nfcMac
      };
      console.log(data);
      let res = await service.updateNfc(data, {
        headers: { "Content-Type": "application/json" }
      });
      if (res.errorCode === 0) {
        this.$message({
          message: "修改成功",
          type: "warning"
        });
        this.dialogFormVisible = false;
        this.queryNfcAll();
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
    // async queryNfcAll() {
    //   let data = {
    //     page: this.currentPage,
    //     pageSize: this.pagesize,
    //     nfcId: this.query.searchNO,
    //     nfcMac: this.query.searchID
    //   };
    //   console.log(data);
    //   let res = await service.queryNfcAll(data, {});

    //   if (res.errorCode === 0) {
    //     console.log(res);
    //     this.tableData = res.data.data;
    //     this.totalCount = res.data.totalCount;
    //   }
    // }
    async queryNfcAll() {
      let data = {
        page: this.currentPage,
        pageSize: this.pagesize,
        nfcId: this.query.searchNO,
        nfcMac: this.query.searchID
      };
      let res = await service.queryNfcAll(data, {
        headers: { "Content-Type": "application/json" }
      });
      if (res.errorCode === 0) {
        this.tableData = res.data.data;
        this.totalCount = res.data.totalCount;
      }
    }
  },
  created() {
    this.queryLabel();
    this.queryNfcAll();
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
