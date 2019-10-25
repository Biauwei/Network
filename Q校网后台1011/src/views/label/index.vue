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
          <el-form-item label="标签类型">
            <el-select v-model="query.queryType" placeholder="选择标签类型">
              <el-option
                v-for="item in labelsType"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="标签名称">
            <el-input v-model="query.name" placeholder="请输入标签名称" maxlength="10"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-search" type="primary" @click="search">查询</el-button>
            <el-button icon="el-icon-plus" type="primary" @click="handleAdd">添加标签</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="page-bd">
      <!-- 表格数据 -->
      <el-table :data="tableData" style="width: 100%" size="small">
        <el-table-column label="标签ID" prop="labelId"></el-table-column>
        <el-table-column label="标签类型" prop="type" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span size="mini" v-if="scope.row.type === 0">全部</span>
            <span size="mini" v-else-if="scope.row.type === 1">特色</span>
            <span size="mini" v-else-if="scope.row.type === 2">商圈</span>
            <span size="mini" v-else>冠名企业</span>
          </template>
        </el-table-column>
        <el-table-column label="标签名称" prop="name" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="描述" prop="description" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDel(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="page-ft"></div>
    <!-- 新增 or 编辑 -->
    <template>
      <el-dialog top="40px" title :visible.sync="dialogFormVisible">
        <span slot="title" class="dialog-title">{{ isShow ? '新增标签': '编辑标签' }}</span>
        <el-form ref="form" :model="form" status-icon size="small" :label-width="formLabelWidth">
          <el-form-item
            label="标签名称"
            prop="name"
            :rules="[
              { required: true, message: '请输入标签名称', trigger: 'blur' }
            ]"
          >
            <el-input v-model="form.name" placeholder="请输入标签名称"></el-input>
          </el-form-item>
          <el-form-item
            label="标签类型"
            prop="type"
            :rules="[
              { required: true, message: '请选择标签类型', trigger: 'blur' }
            ]"
          >
            <el-select v-model="form.type" placeholder="选择标签类型">
              <el-option
                v-for="item in labelsFilter"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="标签描述"
            prop="description"
            :rules="[
              { required: true, message: '请输入标签描述', trigger: 'blur' }
            ]"
          >
            <el-input type="textarea" v-model="form.description" :rows="5" placeholder="请输入标签描述"></el-input>
          </el-form-item>
        </el-form>
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
import QTable from "@/components/QTable";
import pageMixins from "@/mixins/page";
export default {
  name: "labels",
  inject: ["reload"], //注入依赖
  components: {
    "base-table": QTable
  },
  mixins: [pageMixins],
  data() {
    return {
      isShow: true,
      query: {
        queryType: 0,
        name: ""
      },
      form: {
        labelId: null,
        type: null,
        name: "",
        description: ""
      },
      labelsType: [
        { id: 0, name: "全部" },
        { id: 1, name: "特色" },
        { id: 2, name: "商圈" },
        { id: 3, name: "冠名企业" }
      ]
    };
  },
  computed: {
    labelsFilter() {
      return this.labelsType.filter(elem => elem.id > 0);
    }
  },
  methods: {
    search() {
      this.queryLabel(this.query);
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.addLabel(this.form);
        }
      });
    },
    handleAdd() {
      this.isShow = true;
      this.dialogFormVisible = true;
      this.form = {};
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
          this.deleteLabel(row.labelId);
        })
        .catch(error => {
          return false;
        });
    },
    //查询标签列表
    async queryLabel(params = {}) {
      let res = await service.queryLabel(params);
      if (res.errorCode === 0) {
        this.tableData = res.data;
      }
    },
    //新增标签
    async addLabel(params = {}) {
      let res = await service.addLabel(params);
      if (res.errorCode === 0) {
        this.dialogFormVisible = false;
        this.queryLabel(this.query);
      }
    },
    //删除标签
    async deleteLabel(labelId) {
      let res = await service.deleteLabel({ labelId });
      if (res.errorCode === 0) {
        this.queryLabel(this.query);
      }
    }
  },
  mounted() {
    this.queryLabel(this.query);
  }
};
</script>
<style lang="less" scoped>
</style>
