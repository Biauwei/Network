<template>
  <div class="page">
    <div class="page-hd">
      <div class="page-form" style="padding-bottom: 18px;">
        <el-button size="small" icon="el-icon-plus" type="primary" @click="handleAdd">新增网站菜单</el-button>
      </div>
    </div>
    <div class="page-bd">
      <!-- 表格数据 -->
      <template>
        <el-table :data="tableData" style="width: 100%" size="small">
          <el-table-column label="序号" prop="id"></el-table-column>
          <el-table-column label="网站菜单" prop="menuName"></el-table-column>
          <el-table-column label="页数" prop="page"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
              <el-button size="mini" type="danger" @click="handleDel(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </div>
    <div class="page-ft"></div>
  </div>
</template>
<script>
import service from "@/api";
export default {
  name: "portalMenu",
  data() {
    return {
      portalId: this.$route.params.id,
      tableData: []
    };
  },
  methods: {
    handleAdd() {
      this.$router.push({ path: `/portalweb/add/9527` });
    },
    handleEdit(row) {
      console.log(row);
      this.$router.push({ path: `/portalweb/edit/${row.id}` });
    },
    handleDel(row) {
      console.log(row);
      this.$confirm(`确定删除吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.deletePortalWeb(row.id);
        })
        .catch(error => {
          return false;
        });
    },
    //查询学校门户网站菜单内容
    async queryPortalWebMenu() {
      let res = await service.queryPortalWebMenu({});
      if (res.errorCode === 0) {
        this.tableData = res.data;
      }
    },
    //删除学校门户网站菜单
    async deletePortalWeb(menuId) {
      let res = await service.deletePortalWeb({ menuId });
      if (res.errorCode === 0) {
        this.queryPortalWebMenu(this.portalId);
      }
    }
  },
  activated() {
    this.queryPortalWebMenu();
  }
};
</script>
<style lang="less" scoped>
</style>
