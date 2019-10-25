<template>
  <div class="page">
    <div class="page-hd"></div>
    <div class="page-bd">
      <!-- 表格数据 -->
      <template>
        <el-table :data="tableData" style="width: 100%" size="small">
          <el-table-column label="学校ID" prop="schoolId"></el-table-column>
          <el-table-column label="审核节点" prop="status">
            <template slot-scope="scope">
              <span v-if="scope.row.status === 0" style="color:#409EFF">待审核</span>
              <span v-else-if="scope.row.status === 1" style="color:#409EFF">审核通过</span>
              <span v-else style="color:#F56C6C;">审核不通过</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
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
  name: "portalUrl",
  data() {
    return {
      tableData: []
    };
  },
  methods: {
    handleEdit(row) {
      this.$router.push({ path: `/portalweb/menu/1` });
    },
    async queryPortalWeb() {
      let res = await service.queryPortalWeb({});
      if (res.errorCode === 0) {
        this.tableData = res.data;
      }
    }
  },
  activated() {
    this.queryPortalWeb();
  }
};
</script>
<style lang="less" scoped>
</style>
