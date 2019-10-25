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
          <el-form-item label="区域选择">
            <qx-region-t @regionChange="handleRegionChange" :scopeType.sync="scopeType"></qx-region-t>
          </el-form-item>
          <el-form-item label="学校名称">
            <el-input v-model="query.schoolName" placeholder="请输入学校名称"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-search" type="primary" @click="handleSearch">查询</el-button>
            <el-button icon="el-icon-plus" type="primary" @click="handleAddSchool">新增学校</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="page-bd">
      <!-- 表格数据 -->
      <template>
        <el-table :data="tableData" style="width: 100%" stripe size="small">
          <el-table-column label="学校ID" prop="schoolId" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column label="学校名称" prop="name" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span
                style="color:#409EFF;cursor:pointer;"
                @click="handleViewInfo(scope.row)"
              >{{ scope.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column label="学校性质" prop="propertyName" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column label="学校类型" prop="typeName" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column label="负责人" prop="headName" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span v-if="scope.row.headName === null">无</span>
              <span v-else>{{ scope.row.headName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="负责人电话" prop="headPhone" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span v-if="scope.row.headPhone === null">无</span>
              <span v-else>{{ scope.row.headPhone }}</span>
            </template>
          </el-table-column>
          <el-table-column label="地址" prop="address" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
              <el-button size="mini" type="danger" @click="handleDel(scope.row)">删除</el-button>
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
    <!-- 查看学校信息 -->
    <template>
      <el-dialog width="70%" title="学校信息详情" top="40px" :visible.sync="dialogView">
        <div class="qx-card">
          <!-- <div class="qx-card-head">
            <div class="qx-card-head-wrapper">
              <div class="qx-card-head-title">学校信息详情</div>
            </div>
          </div>-->
          <div class="qx-card-body">
            <el-row :gutter="10">
              <el-col :span="8">
                <div class="qx-trem">区域</div>
                <div
                  class="qx-detail"
                >{{ info.provinceName }} {{ info.cityName }} {{ info.regionName }}</div>
              </el-col>
              <el-col :span="8">
                <div class="qx-trem">详细地址</div>
                <div class="qx-detail">{{ info.address }}</div>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="8">
                <div class="qx-trem">学校名称</div>
                <div class="qx-detail">{{ info.name }}</div>
              </el-col>
              <el-col :span="8">
                <div class="qx-trem">学校性质</div>
                <div class="qx-detail">{{ info.propertyName }}</div>
              </el-col>
              <el-col :span="8">
                <div class="qx-trem">学校类型</div>
                <div class="qx-detail">{{ info.propertyName }}</div>
              </el-col>
              <el-col :span="8">
                <div class="qx-trem">办学元年</div>
                <div class="qx-detail">{{ info.firstYear }}</div>
              </el-col>
              <el-col :span="8">
                <div class="qx-trem">班级数量</div>
                <div class="qx-detail">{{ info.classNumber }}</div>
              </el-col>
              <el-col :span="8">
                <div class="qx-trem">学校人数</div>
                <div class="qx-detail">{{ info.studentNumber }}</div>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="8">
                <div class="qx-trem">校长</div>
                <div class="qx-detail">{{ info.masterName }}</div>
              </el-col>
              <el-col :span="8">
                <div class="qx-trem">校长电话</div>
                <div class="qx-detail">{{ info.masterPhone }}</div>
              </el-col>
              <el-col :span="8">
                <div class="qx-trem">校长邮箱</div>
                <div class="qx-detail">{{ info.masterEmail }}</div>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="8">
                <div class="qx-trem">负责人</div>
                <div class="qx-detail">{{ info.headName }}</div>
              </el-col>
              <el-col :span="8">
                <div class="qx-trem">负责人电话</div>
                <div class="qx-detail">{{ info.headPhone }}</div>
              </el-col>
              <el-col :span="8">
                <div class="qx-trem">负责人邮箱</div>
                <div class="qx-detail">{{ info.headEmail }}</div>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="24">
                <div class="qx-trem">学校标签</div>
                <div class="qx-detail">
                  <span v-for="(tag, index) in info.label" :key="index">{{ tag.name }}</span>
                </div>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="8">
                <div class="qx-trem">学校标语</div>
                <div class="qx-detail">{{ info.slogan }}</div>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="24">
                <div class="qx-trem">学校描述</div>
                <div class="qx-detail">{{ info.description }}</div>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="12" v-for="(item, index) in info.schoolImage" :key="index">
                <div class="qx-honour" :style="{ backgroundImage: `url(${item.imageUrl})` }"></div>
              </el-col>
            </el-row>
          </div>
        </div>
      </el-dialog>
    </template>
  </div>
</template>
<script>
import service from "@/api";
import regiont from "@/components/qxregion";
import { mapGetters } from "vuex";
import pageMixins from "@/mixins/page";
export default {
  name: "schoolManagement",
  components: {
    "qx-region-t": regiont
  },
  mixins: [pageMixins],
  data() {
    return {
      dialogView: false,
      info: {},
      query: {
        queryId: this.$store.getters.scopeId,
        queryType: this.$store.getters.scopeType,
        schoolName: ""
      },
      schoolId: null,
      //学校
      schoolList: []
    };
  },
  computed: {
    ...mapGetters(["scopeType"])
  },
  methods: {
    handleCurrentChange(curr) {
      this.query.page = curr;
      this.showSchoolList();
    },
    handleSizeChange(size) {
      this.query.pageSize = size;
      this.showSchoolList();
    },
    handleRegionChange(queryId, queryType) {
      this.query.queryId = queryId;
      this.query.queryType = queryType;
    },
    handleSearch() {
      this.showSchoolList(this.query);
    },
    handleViewInfo(row) {
      this.dialogView = true;
      this.info = { ...row };
    },
    //新增学校
    handleAddSchool() {
      this.$router.push({ path: "/school/add" });
    },
    handleEdit(row) {
      this.$router.push({ path: `/school/edit/${row.schoolId}` });
    },
    //学校删除
    handleDel(row) {
      this.$confirm(`确定要删除学校吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.deleteSchool(row.schoolId);
        })
        .catch(error => {
          return false;
        });
    },
    //根据区域ID查省市
    async findRegion(regionId) {
      let res = await service.findRegion({ regionId });
      if (res.errorCode === 0) {
        this.edit.regionId = [
          res.data.province,
          res.data.city,
          res.data.region
        ];
      }
    },
    //删除学校
    async deleteSchool(schoolId) {
      let res = await service.deleteSchool({ schoolId });
      if (res.errorCode === 0) {
        this.$message({ message: `${res.errorMsg}`, type: "success" });
        this.showSchoolList();
      }
    },
    //显示学校列表
    async showSchoolList() {
      let res = await service.showSchoolList(this.query);
      if (res.errorCode === 0) {
        this.tableData = res.data.data;
        this.totalCount = res.data.totalCount;
      } else if (res.errorCode === -1) {
      }
    }
  },
  activated() {
    this.showSchoolList();
  }
};
</script>
<style lang="less" scoped>
.qx-card {
  color: rgba(0, 0, 0, 0.65);
  background: #fff;
  border-radius: 2px;
  position: relative;
}
.qx-card-head {
  font-size: 16px;
  font-weight: 500;
  min-height: 48px;
  padding: 0;
  border-bottom: 1px solid #e8e8e8;
  border-radius: 2px 2px 0 0;
}
.qx-card-head-wrapper {
  display: flex;
}
.qx-card-head-title {
  display: inline-block;
  flex: 1 1;
  overflow: hidden;
  padding: 16px 0;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.qx-trem {
  display: table-cell;
  white-space: nowrap;
  line-height: 20px;
  padding-bottom: 16px;
  color: rgba(0, 0, 0, 0.85);
  &::after {
    content: ":";
    margin: 0 8px 0 2px;
    position: relative;
    top: -0.5px;
  }
}
.qx-detail {
  display: table-cell;
  line-height: 22px;
  padding-bottom: 16px;
  color: #409eff;
  span {
    color: #fff;
    padding: 1px 10px;
    font-size: 12px;
    margin-right: 3px;
    display: inline-block;
    background: -webkit-gradient(
      linear,
      0% 0%,
      0% 100%,
      from(#3c8ce7),
      to(#0396ff)
    );
  }
}
.qx-honour {
  width: 446px;
  height: 240px;
  margin-top: 10px;
  background-size: cover;
}
</style>
