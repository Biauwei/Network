<template>
  <div class="page">
    <div class="page-hd"></div>
    <div class="page-bd">
      <div class="page-form" style="padding-bottom: 18px;">
        <el-button icon="el-icon-plus" type="primary" size="small" @click="dialogAdd = true">新增一级菜单</el-button>
        <qx-treeTable :data="data" :columns="columns">
          <el-table-column label="状态" prop="status">
            <template slot-scope="scope">
              <span v-if="scope.row.status === 0" style="color:#67C23A;">正常</span>
              <span v-else style="color:#F56C6C;">关闭</span>
            </template>
          </el-table-column>
          <el-table-column label="平台类型" prop="flatFlag">
            <template slot-scope="scope">
              <span v-if="scope.row.flatFlag === 0">PC端</span>
              <span v-else>手机端</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" plain @click="handleChild(scope.row)">新增子菜单</el-button>
              <el-button size="mini" type="primary" plain @click="handleEdit(scope.row)">编辑</el-button>
              <template v-if="scope.row.children === null && !scope.row.children">
                <el-button size="mini" type="danger" plain @click="handleDel(scope.row)">删除</el-button>
              </template>
              <template v-else-if="scope.row.children.length === 0">
                <el-button size="mini" type="danger" plain @click="handleDel(scope.row)">删除</el-button>
              </template>
            </template>
          </el-table-column>
        </qx-treeTable>
      </div>
    </div>
    <div class="page-ft"></div>
    <!-- 新增 -->
    <template>
      <el-dialog top="40px" title="新增菜单名称" :visible.sync="dialogAdd">
        <el-form
          ref="addForm"
          :model="addForm"
          status-icon
          size="small"
          :label-width="formLabelWidth"
        >
          <el-form-item label="状态" prop="status">
            <el-radio-group v-model="addForm.status">
              <el-radio :label="0">开启</el-radio>
              <el-radio :label="1">关闭</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="平台类型" prop="flatFlag">
            <el-radio-group v-model="addForm.flatFlag">
              <el-radio :label="0">PC端</el-radio>
              <el-radio :label="1">手机端</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            label="菜单名称"
            prop="permitName"
            :rules="[
              { required: true, message: '请输入菜单名称', trigger: 'blur' }
            ]"
          >
            <el-input v-model="addForm.permitName" placeholder="菜单名称"></el-input>
          </el-form-item>
          <el-form-item
            label="菜单路径"
            prop="url"
            :rules="[
              { required: true, message: '请输入菜单路径', trigger: 'blur' }
            ]"
          >
            <el-input v-model="addForm.url" placeholder="访问路径"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="dialogAdd = false">取消</el-button>
          <el-button size="small" type="primary" @click="addFormSubmit('addForm')">确定</el-button>
        </span>
      </el-dialog>
    </template>
    <!-- 编辑 -->
    <template>
      <el-dialog top="40px" title="编辑菜单名称" :visible.sync="dialogEdit">
        <el-form
          ref="editForm"
          :model="editForm"
          status-icon
          size="small"
          :label-width="formLabelWidth"
        >
          <el-form-item label="状态" prop="status">
            <el-radio-group v-model="editForm.status">
              <el-radio :label="0">开启</el-radio>
              <el-radio :label="1">关闭</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="平台类型" prop="flatFlag">
            <el-radio-group v-model="editForm.flatFlag">
              <el-radio :label="0">PC端</el-radio>
              <el-radio :label="1">手机端</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="权限ID" prop="permitId">
            <el-input v-model="editForm.permitId" disabled></el-input>
          </el-form-item>
          <el-form-item label="菜单名称" prop="permitName">
            <el-input v-model="editForm.permitName" placeholder="权限名称"></el-input>
          </el-form-item>
          <el-form-item label="菜单路径" prop="url">
            <el-input v-model="editForm.url" placeholder="权限链接"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="dialogEdit = false">取消</el-button>
          <el-button size="small" type="primary" @click="editFormSubmit('editForm')">确定</el-button>
        </span>
      </el-dialog>
    </template>
  </div>
</template>
<script>
import service from "@/api";
import treeTable from "@/components/treeTable";
export default {
  name: "menus",
  components: {
    "qx-treeTable": treeTable
  },
  data() {
    return {
      dialogAdd: false,
      dialogEdit: false,
      formLabelWidth: "100px",
      query: {
        page: 1,
        pageSize: 50
      },
      addForm: {
        status: 0, //开启
        flatFlag: 0,
        parent: 0,
        isleaf: 0
      },
      editForm: {},
      rules: {},
      parentIds: [],
      columns: [
        {
          text: "菜单名称",
          value: "permitName"
        },
        {
          text: "菜单权限ID",
          value: "permitId"
        },
        {
          text: "访问路径",
          value: "url"
        }
      ],
      data: []
    };
  },
  methods: {
    handleChild(row) {
      this.dialogAdd = true;
      let { parent, permitId } = row;
      //菜单添加
      if (typeof parent === "number") {
        this.addForm.parent = permitId;
      }
    },
    handleEdit(row) {
      this.dialogEdit = true;
      this.editForm = Object.assign({}, row);
    },
    handleDel(row) {
      this.$confirm(`确定删除该菜单吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.deletePermit(row.permitId);
        })
        .catch(error => {
          return false;
        });
    },
    addFormSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.addPermit(this.addForm);
        }
      });
    },
    //编辑菜单
    editFormSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let {
            _expanded,
            _level,
            _show,
            children,
            parent,
            ...args
          } = this.editForm;
          if (typeof parent === "object") {
            parent = parent.permitId;
          } else {
            parent = 0;
          }
          let obj = Object.assign({}, args, { parent });
          this.updatePermit(obj);
        }
      });
    },
    //新增权限
    async addPermit(params = {}) {
      let res = await service.addPermit(params);
      if (res.errorCode === 0) {
        this.dialogAdd = false;
        this.querySystemMenu(this.query);
      }
    },
    //删除权限
    async deletePermit(permitId) {
      let res = await service.deletePermit({ permitId });
      if (res.errorCode === 0) {
        this.querySystemMenu(this.query);
      }
    },
    //编辑权限
    async updatePermit(params = {}) {
      let res = await service.updatePermit(params);
      if (res.errorCode === 0) {
        this.dialogEdit = false;
        this.querySystemMenu(this.query);
      }
    },
    //权限列表（系统菜单）
    async querySystemMenu(params = {}) {
      let res = await service.querySystemMenu(params);
      if (res.errorCode === 0) {
        this.data = res.data;
      }
    }
  },
  created() {
    this.querySystemMenu(this.query);
  }
};
</script>
<style lang="less" scoped>
</style>
