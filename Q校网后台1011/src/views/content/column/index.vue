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
          <el-form-item label="栏目名称">
            <el-input v-model="query.channelName" placeholder="请输入栏目名称" maxlength="40"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-search" type="primary" @click="handleSearch">查询</el-button>
            <el-button icon="el-icon-plus" type="primary" @click="handleAdd">新增栏目</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="page-bd">
      <!-- 表格数据 -->
      <base-table :data="tableData" :columns="columns">
        <el-table-column width="200" label="操作">
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
            small
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
    <!-- 新增 or 编辑 -->
    <template>
      <el-dialog top="40px" title :visible.sync="dialogFormVisible">
        <span slot="title" class="dialog-title">{{ isShow ? '新增': '编辑' }}</span>
        <el-form ref="form" :model="form" status-icon size="small" :label-width="formLabelWidth">
          <el-form-item
            label="栏目名称"
            prop="name"
            :rules="[
              { required: true, message: '请输入栏目名称', trigger: 'blur' }
            ]"
          >
            <el-input v-model="form.name" placeholder="请输入栏目名称"></el-input>
          </el-form-item>
          <el-form-item
            label="栏目描述"
            prop="description"
            :rules="[
              { required: true, message: '请输入栏目描述', trigger: 'blur' }
            ]"
          >
            <el-input type="textarea" v-model="form.description" :rows="5" placeholder="请输入栏目描述"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="dialogFormVisible = false">取消</el-button>
          <el-button size="small" type="primary" @click="formSubmit('form')">确定</el-button>
        </span>
      </el-dialog>
    </template>
  </div>
</template>
<script>
import service from "@/api";
import QTable from "@/components/QTable";
import pageMixins from "@/mixins/page";
export default {
  name: "column",
  inject: ["reload"], //注入依赖
  components: {
    "base-table": QTable
  },
  mixins: [pageMixins],
  data() {
    return {
      columns: [
        {
          label: "栏目ID",
          prop: "channelId"
        },
        {
          label: "栏目名称",
          prop: "name"
        },
        {
          label: "栏目描述",
          prop: "description"
        }
      ],
      query: {
        channelName: ""
      },
      form: {
        name: "",
        description: ""
      }
    };
  },
  methods: {
    handleCurrentChange(curr) {
      this.query.page = curr;
      this.queryChannel();
    },
    handleSizeChange(size) {
      this.query.pageSize = size;
      this.queryChannel();
    },
    handleSearch() {
      this.queryChannel();
    },
    handleAdd() {
      this.form = {};
      this.isShow = true;
      this.dialogFormVisible = true;
    },
    handleEdit(row) {
      this.isShow = false;
      this.dialogFormVisible = true;
      this.form = Object.assign({}, row);
    },
    handleDel(row) {
      this.$confirm(`确定删除吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.deleteChannel(row.channelId);
        })
        .catch(error => {
          return false;
        });
    },
    formSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let { postTime, ...args } = this.form;
          if (args.channelId) {
            this.updateChannel(args);
          } else {
            this.addChannel(this.form);
          }
        }
      });
    },
    //显示栏目列表
    async queryChannel() {
      let res = await service.queryChannel(this.query);
      if (res.errorCode === 0) {
        this.tableData = res.data.data;
        this.totalCount = res.data.totalCount;
      }
    },
    //新增栏目
    async addChannel(params = {}) {
      let res = await service.addChannel(params);
      if (res.errorCode === 0) {
        this.dialogFormVisible = false;
        this.queryChannel();
      } else if (res.errorCode === 1 || res.errorCode === -1) {
        this.$message({ message: `${res.errorMsg}`, type: "warning" });
      }
    },
    //编辑栏目
    async updateChannel(params = {}) {
      let res = await service.updateChannel(params);
      if (res.errorCode === 0) {
        this.dialogFormVisible = false;
        this.queryChannel();
      }
    },
    //删除栏目
    async deleteChannel(channelId) {
      let res = await service.deleteChannel({ channelId });
      if (res.errorCode === 0) {
        this.queryChannel();
      }
    }
  },
  mounted() {
    this.queryChannel();
  }
};
</script>
<style lang="less" scoped>
</style>
