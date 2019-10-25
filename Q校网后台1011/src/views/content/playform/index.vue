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
            <qx-region-t @regionChange="handleRegionChange" :scopeType="scopeType"></qx-region-t>
          </el-form-item>
          <el-form-item label="学校名称">
            <el-input v-model="query.schoolName" placeholder="请输入学校名称"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-search" type="primary" @click="handleSearch">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="page-bd">
      <!-- 表格数据 -->
      <template>
        <el-table :data="tableData" style="width: 100%" size="small">
          <el-table-column label="学校ID" prop="schoolId"></el-table-column>
          <el-table-column label="学校名称" prop="schoolName"></el-table-column>
          <el-table-column label="区域" prop="region"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="handleShowPlayList(scope.row)">查看播放列表</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
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
  </div>
</template>
<script>
import service from "@/api";
import regiont from "@/components/qxregion";
import { mapGetters } from "vuex";
import pageMixins from "@/mixins/page";
export default {
  name: "playform",
  components: {
    "qx-region-t": regiont
  },
  mixins: [pageMixins],
  data() {
    return {
      query: {
        schoolName: "",
        scopeType: this.$store.getters.scopeType,
        scopeId: this.$store.getters.scopeId,
      }
    };
  },
  computed: {
    ...mapGetters(["scopeType"])
  },
  methods: {
    handleSearch() {
      this.schoolList();
    },
    handleCurrentChange(curr) {
      this.query.page = curr;
      this.schoolList();
    },
    handleSizeChange(size) {
      this.query.pageSize = size;
      this.schoolList();
    },
    handleShowPlayList(row) {
      let { schoolName } = row;
      this.$router.push({ path: `/content/playshow/${row.schoolId}` });
    },
    //根据关键字查询学校名称
    handleSelectSchool(value) {
      this.schoolId = value.schoolId;
      this.channelForm.schoolId = value.schoolId;
    },
    handleRegionChange(queryId, queryType) {
      this.query.scopeId = queryId;
      this.query.scopeType = queryType;
    },
    //查询学校列表
    async schoolList() {
      let res = await service.schoolList(this.query);
      if (res.errorCode === 0) {
        this.tableData = res.data.data;
        this.totalCount = res.data.totalCount;
      }
    }
  },
  activated() {
    this.schoolList();
  }
};
</script>
<style lang="less" scoped>
</style>
