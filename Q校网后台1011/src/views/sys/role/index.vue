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
          <el-form-item label="角色名称">
            <el-input v-model.trim="query.roleName" placeholder="请输入角色名称" maxlength="10"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-search" type="primary" @click="search">查询</el-button>
            <el-button icon="el-icon-plus" type="primary" @click="handleAdd">新增角色</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="page-bd">
      <!-- 表格数据 -->
      <base-table :data="tableData" :columns="columns">
        <el-table-column label="操作">
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
          :current-page="query.page"
          :page-size="query.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalCount"
        ></el-pagination>
      </div>
    </div>
    <!-- 新增 or 编辑 -->
    <el-dialog top="40px" :visible.sync="dialogFormVisible" @open="show" @close="close">
      <span slot="title" class="dialog-title">{{ isShow ? '新增': '编辑' }}</span>
      <el-form ref="form" :model="form" status-icon size="small" :label-width="formLabelWidth">
        <el-form-item
          label="角色名称"
          prop="roleName"
          :rules="[
              { required: true, message: '请输入角色名称', trigger: 'blur' }
            ]"
        >
          <el-input v-model="form.roleName" placeholder="请输入角色名称" maxlength="10"></el-input>
        </el-form-item>
        <el-form-item label="角色等级">
          <el-select v-model="form.roleLevel" placeholder="选择标签类型" disabled>
            <el-option
              v-for="item in roleLevelList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="description">
          <el-input type="textarea" v-model="form.description" :rows="4" placeholder="请输入备注"></el-input>
        </el-form-item>
        <el-form-item label="菜单权限设置">
          <!--  -->
          <el-tree
            ref="tree"
            :data="menuData"
            highlight-current
            default-expand-all
            check-on-click-node
            show-checkbox
            node-key="permitId"
            :default-checked-keys="permitIds"
            :props="defaultProps"
          ></el-tree>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogFormVisible = false">取消</el-button>
        <el-button size="small" type="primary" @click="formSubmit('form')">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import service from "@/api";
import QTable from "@/components/QTable";
import pageMixins from "@/mixins/page";
export default {
  name: "role",
  components: {
    "base-table": QTable
  },
  mixins: [pageMixins],
  data() {
    return {
      columns: [
        {
          label: "角色ID",
          prop: "roleId"
        },
        {
          label: "角色名称",
          prop: "roleName"
        },
        {
          label: "角色等级",
          prop: "roleLevel"
        },
        {
          label: "备注",
          prop: "description"
        }
      ],
      query: {
        roleName: ""
      },
      form: {
        roleId: null,
        roleName: "",
        description: "",
        roleLevel: 1
      },
      permitIds: [],
      roleLevelList: [{ id: 1, name: "1" }],
      menuData: [], //菜单数据
      defaultProps: {
        children: "children",
        label: "permitName"
      }
    };
  },
  computed: {
    //设置表格高度
    tableHeight() {
      return window.innerHeight - 255;
    }
  },
  methods: {
    handleCurrentChange(curr) {
      this.query.page = curr;
      this.queryRoleList(this.query);
    },
    handleSizeChange(size) {
      this.query.pageSize = size;
      this.queryRoleList(this.query);
    },
    search() {
      this.queryRoleList(this.query);
    },
    show() {
      if ("permits" in this.form) {
        let permitIdCheck = this.form.permits.map(e => e.permitId);
        this.permitIds = [].concat(permitIdCheck);
      }
    },
    close() {
      this.$refs.tree.setCheckedKeys([]);
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
      this.$confirm(`确定删除该角色吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.deleteRole(row.roleId);
        })
        .catch(error => {
          return false;
        });
    },
    formSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          //获取当前被选中节点的 node
          let ids = this.$refs.tree.getCheckedNodes();
          if (!ids.length) {
            this.$message({ message: `请为角色设置权限菜单`, type: "warning" });
            return false;
          }
          let permitIds = ids.map(elem => elem.permitId);
          let obj = Object.assign({}, this.form, { permitIds });
          //编辑模式
          obj.roleId ? delete obj.permits : delete obj.roleId;
          this.addRole(obj);
        }
      });
    },
    //新增角色
    async addRole(params = {}) {
      let res = await service.addRole(params);
      if (res.errorCode === 0) {
        this.dialogFormVisible = false;
        this.$refs.form.resetFields();
        this.queryRoleList(this.query);
        this.$message({ message: `${res.errorMsg}`, type: "success" });
      } else if (res.errorCode === -1) {
        //角色名称已存在
        this.$message({ message: `${res.errorMsg}`, type: "error" });
      }
    },
    //编辑角色
    async updateRole(params = {}) {
      let res = await service.updateRole(params);
    },
    //删除角色
    async deleteRole(roleId) {
      let res = await service.deleteRole({ roleId });
      if (res.errorCode === 0) {
        this.queryRoleList(this.query);
      } else if (res.errorCode === 1) {
        this.$message({ message: `${res.errorMsg}`, type: "error" });
      }
    },
    //角色列表
    async queryRoleList(params = {}) {
      let res = await service.queryRoleList(params);
      if (res.errorCode === 0) {
        this.tableData = res.data.data;
        this.totalCount = res.data.totalCount;
      }
    },
    //权限列表（系统菜单）
    async querySystemMenu(params = {}) {
      let res = await service.querySystemMenu(params);
      if (res.errorCode === 0) {
        this.menuData = res.data;
      }
    }
  },
  mounted() {
    this.querySystemMenu({ page: 1, pageSize: 50 });
    this.queryRoleList(this.query);
  }
};
</script>
<style lang="less" scoped>
</style>
