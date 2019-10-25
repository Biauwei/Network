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
          <el-form-item label="行为类型">
            <el-select v-model="query.actionType" placeholder="行为类型">
              <el-option
                v-for="item in actionTypeList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-search" type="primary" @click="handleSearch">查询</el-button>
            <el-button icon="el-icon-plus" type="primary" @click="handleAdd">新增</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="page-bd">
      <el-table :data="tableData" style="width: 100%" size="small">
        <el-table-column label="序号" prop="actionId"></el-table-column>
        <el-table-column label="行为名称" prop="title"></el-table-column>
        <el-table-column label="行为说明" prop="textContent"></el-table-column>
        <el-table-column label="评价标准" prop="rules">
          <template slot-scope="scope">
            <el-tag
              size="small"
              v-for="item in scope.row.rules"
              :key="item.ruleId"
            >{{ item.ruleContent }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              :disabled="query.actionType === 1"
              @click="handleEdit(scope.row)"
            >编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              :disabled="query.actionType === 1"
              @click="handleDel(scope.row.actionId)"
            >删除</el-button>
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
    <!-- dialog -->
    <el-dialog top="40px" :visible.sync="dialogFormVisible">
      <span slot="title" class="dialog-title">{{ isShow ? '新增': '编辑' }}</span>
      <el-form ref="form" :model="form" status-icon size="small" :label-width="formLabelWidth">
        <el-form-item
          label="行为名称"
          prop="title"
          :rules="[
          { required: true, message: '请输入行为名称', trigger: 'blur' }
        ]"
        >
          <el-input v-model="form.title" placeholder="请输入行为名称" maxlength="4"></el-input>
        </el-form-item>
        <el-form-item
          label="行为说明"
          prop="textContent"
          :rules="[
          { required: true, message: '请输入行为说明', trigger: 'blur' }
        ]"
        >
          <el-input v-model="form.textContent" placeholder="请输入行为说明"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-plus" size="mini" type="primary" @click="handleAddRules">新增评价标准</el-button>
        </el-form-item>
        <el-row :gutter="5" v-for="(item,index) in form.rules" :key="index">
          <el-col :span="12">
            <el-form-item
              :label="`评价标准`"
              :prop="`rules.${index}.ruleContent`"
              :rules="rulesRules.ruleContent"
            >
              <el-input v-model="item.ruleContent" placeholder="请输入评价标准"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item>
              <el-button
                v-if="form.rules.length != 1"
                size="mini"
                icon="el-icon-delete"
                circle
                type="danger"
                @click="handleRemoveRules(index)"
              ></el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="submitForm('form')">提交</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import service from "@/api";
export default {
  name: "behavior",
  data() {
    return {
      dialogFormVisible: false,
      isShow: false, //判断dialog弹窗是新增还是编辑
      formLabelWidth: "100px",
      actionTypeList: [
        {
          id: 0,
          name: "系统默认"
        },
        {
          id: 1,
          name: "自定义"
        }
      ],
      query: {
        actionType: 0,
        page: 1,
        pageSize: 20
      },
      form: {
        title: "",
        textContent: "",
        rules: []
      },
      rules: [{ ruleContent: "" }],
      rulesRules: {
        ruleContent: [
          {
            required: true,
            message: "请填写行为标准",
            trigger: "blur"
          }
        ]
      },
      tableData: [],
      totalCount: 0
    };
  },
  methods: {
    handleSearch() {
      this.query.page = 1;
      this.queryAllAction(this.query);
    },
    handleCurrentChange(curr) {
      this.query.page = curr;
      this.queryAllAction(this.query);
    },
    handleSizeChange(size) {
      this.query.pageSize = size;
      this.queryAllAction(this.query);
    },
    handleAdd() {
      this.isShow = true;
      this.dialogFormVisible = true;
      this.form = {
        rules: [{ ruleId: 0, ruleContent: "" }]
      };
    },
    handleEdit(row) {
      this.isShow = false;
      this.dialogFormVisible = true;
      this.form = Object.assign({}, row);
    },
    handleDel(actionId) {
      this.$confirm(`确定删除吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.deleteAction(actionId);
        })
        .catch(error => {
          return false;
        });
    },
    handleAddRules() {
      this.form.rules.push({ ruleId: 0, ruleContent: "" });
    },
    handleRemoveRules(index) {
      return this.form.rules.splice(index, 1);
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.isShow) {
            this.addAction(this.form);
          } else {
            this.updateDefault(this.form);
          }
        }
      });
    },
    //查询所有行为
    async queryAllAction(params = {}) {
      let res = await service.queryAllAction(params, {
        headers: { "Content-Type": "application/json" }
      });
      if (res.errorCode === 0) {
        this.tableData = res.data.data;
        this.totalCount = res.data.totalCount;
      }
    },
    //编辑系统默认行为
    async updateDefault(params = {}) {
      let res = await service.updateDefault(params, {
        headers: { "Content-Type": "application/json" }
      });
      if (res.errorCode === 0) {
        this.dialogFormVisible = false;
        this.$refs.form.resetFields();
        this.queryAllAction(this.query);
      }
    },
    //删除系统默认行为
    async deleteAction(actionId) {
      let res = await service.deleteAction(
        { actionId },
        {
          headers: { "Content-Type": "application/json" }
        }
      );
      if (res.errorCode === 0) {
        this.queryAllAction(this.query);
      }
    },
    //新增系统默认行为
    async addAction(params = {}) {
      let res = await service.addAction(params, {
        headers: { "Content-Type": "application/json" }
      });
      if (res.errorCode === 0) {
        this.dialogFormVisible = false;
        this.$refs.form.resetFields();
        this.queryAllAction(this.query);
      }
    }
  },
  mounted() {
    this.queryAllAction(this.query);
  }
};
</script>
<style lang="less" scoped>
</style>
