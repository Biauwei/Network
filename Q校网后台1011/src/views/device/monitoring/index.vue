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
          <el-form-item label="设备状态">
            <el-select v-model="query.status" placeholder="请选择设备状态">
              <el-option
                v-for="item in deviceStatus"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-search" type="primary" @click="handleSearch">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="page-bd">
      <!-- 设备列表 -->
      <template>
        <div class="container-block">
          <el-row :gutter="20">
            <el-col
              :xs="8"
              :sm="8"
              :md="6"
              :lg="4"
              :xl="4"
              v-for="(item,index) in tableData"
              :key="index"
            >
              <div
                class="waterfall-panel"
                v-loading="item.loading"
                :element-loading-text="loadingText"
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(0, 0, 0, 0.8)"
              >
                <a
                  href="javascript:;"
                  @click="showDeviceDetail(item.deviceId)"
                  :style="{backgroundImage: `url(${item.snapshotUrl})`}"
                ></a>
                <div class="layer">
                  <h4>
                    <template v-if="item.schoolName !== null">{{ item.schoolName }}</template>
                    <template v-else>该设备无标题</template>
                  </h4>
                  <span>{{ item.postTime }}</span>
                  <div class="status">
                    <span v-if="item.status === 0" style="color:#67C23A">正常</span>
                    <span v-else-if="item.status === 1" style="color:#F56C6C">故障</span>
                    <span v-else style="color:#909399">正常关机</span>
                  </div>
                  <div class="handle">
                    <el-button size="mini" type="text" @click="handleRestart(item)">重启</el-button>
                    <el-button size="mini" type="text" @click="handleUpdate(item)">刷新</el-button>
                    <el-button size="mini" type="text" @click="handleMon">实时监控</el-button>
                    <el-button size="mini" type="text" @click="handleRunlog(item)">运行日志</el-button>
                  </div>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
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
    <!-- 设备详情 -->
    <template>
      <el-dialog
        width="60%"
        top="40px"
        title="设备详情查看"
        :visible.sync="dialogView"
        :modal-append-to-body="false"
      >
        <el-row :gutter="10" type="flex" class="row-bg">
          <div class="one">
            <img :src="viewDevice.snapshotUrl" class="image" width="500" height="736">
          </div>
          <div class="two">
            <div class="list">
              <p>
                学校：
                <span>{{ viewDevice.schoolName }}</span>
              </p>
              <p>
                设备编号：
                <span>{{ viewDevice.deviceNo }}</span>
              </p>
              <p>
                设备IP：
                <span>{{ viewDevice.ip }}</span>
              </p>
              <p>
                MAC地址：
                <span>{{ viewDevice.mac }}</span>
              </p>
              <p>
                设备状态：
                <span v-if="viewDevice.status === 0" style="color:#67C23A">正常</span>
                <span v-else-if="viewDevice.status === 1" style="color:#F56C6C;">故障</span>
                <span v-else style="color:#E6A23C;">正常关机</span>
              </p>
              <p>
                安装位置：
                <span>{{ viewDevice.address }}</span>
              </p>
              <p>
                设备管理员：
                <span>{{ viewDevice.manager }}</span>
              </p>
              <p>
                联系电话：
                <span>{{ viewDevice.phone }}</span>
              </p>
              <p>
                快照时间：
                <span>{{ viewDevice.snapshotTime }}</span>
              </p>
            </div>
          </div>
        </el-row>
      </el-dialog>
    </template>
    <!-- 设备运行日志 -->
    <template>
      <el-dialog width="80%" top="40px" title="设备运行日志" :visible.sync="dialogRunlog">
        <el-table :data="runlogData" style="width: 100%" stripe size="small">
          <el-table-column label="日志id" prop="logId" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column label="设备id" prop="deviceId" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column label="学校名称" prop="schoolName" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column label="mac地址" prop="mac" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column label="日志详细信息" prop="logText" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column label="状态码" prop="status" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <p v-if="scope.row.status === 0">正常</p>
              <p v-else-if="scope.row.status === 1">故障</p>
              <p v-else>正常关机</p>
            </template>
          </el-table-column>
          <el-table-column label="错误码" prop="deviceError" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column :resizable="false" label="日志级别" prop="level">
            <template slot-scope="scope">
              <p v-if="scope.row.level === 0">无法描述的错误</p>
              <p v-else-if="scope.row.level === 1" style="color:#909399">INFO级别</p>
              <p v-else-if="scope.row.level === 2" style="color:#E6A23C">错误</p>
              <p v-else style="color:#F56C6C">严重</p>
            </template>
          </el-table-column>
          <el-table-column label="日志时间" prop="postTime" :show-overflow-tooltip="true"></el-table-column>
        </el-table>
      </el-dialog>
    </template>
  </div>
</template>
<script>
import service from "@/api";
import regiont from "@/components/qxregion";
import { device } from "@/mixins";
import { mapGetters } from "vuex";
import pageMixins from "@/mixins/page";
export default {
  name: "monitoring",
  components: {
    "qx-region-t": regiont
  },
  mixins: [device, pageMixins],
  data() {
    return {
      dialogAdd: false,
      dialogView: false,
      dialogRunlog: false,
      loading: false,
      loadingText: "",
      schoolList: [],
      schoolId: null,
      query: {
        schoolName: "",
        scopeType: this.$store.getters.scopeType,
        scopeId: this.$store.getters.scopeId,
        status: 0
      },
      viewDevice: {},
      runlogData: []
    };
  },
  computed: {
    ...mapGetters(["scopeType"])
  },
  methods: {
    handleCurrentChange(curr) {
      this.query.page = curr;
      this.showDeviceStatus();
    },
    handleSizeChange(size) {
      this.query.pageSize = size;
      this.showDeviceStatus();
    },
    handleSearch() {
      this.showDeviceStatus();
    },
    handleRegionChange(queryId, queryType) {
      this.query.scopeId = queryId;
      this.query.scopeType = queryType;
    },
    handleRunlog(row) {
      this.dialogRunlog = true;
      this.showDeviceRunlog(row.deviceId);
    },
    handleRestart(item) {
      let params = {
        deviceId: item.deviceId,
        cmd: "system_reboot"
      };
      this.loadingText = "设备重启中";
      this.$set(item, "loading", true);
      setTimeout(() => {
        this.action(params, item);
      }, 1000);
    },
    handleUpdate(item) {
      let params = {
        deviceId: item.deviceId,
        cmd: "content_refresh"
      };
      this.loadingText = "设备刷新中";
      this.$set(item, "loading", true);
      setTimeout(() => {
        this.action(params, item);
      }, 1000);
    },
    handleMon() {},
    //显示设备运行日志
    async showDeviceRunlog(deviceId) {
      let res = await service.showDeviceRunlog({ deviceId });
      if (res.errorCode === 0) {
        this.runlogData = res.data;
      }
    },
    //显示设备详情
    async showDeviceDetail(deviceId) {
      let res = await service.showDeviceDetail({ deviceId });
      if (res.errorCode === 0) {
        this.viewDevice = res.data;
        this.dialogView = true;
      }
    },
    //显示设备状态列表
    async showDeviceStatus() {
      let res = await service.showDeviceStatus(this.query);
      if (res.errorCode === 0) {
        this.tableData = res.data.data;
        this.totalCount = res.data.totalCount;
      }
    },
    //发送设备命令
    async action(params = {}, item) {
      let res = await service.action(params);
      if (res.errorCode === 0) {
        if ("system_reboot" === params.cmd) {
          this.$message({ message: `设备重启成功`, type: "success" });
        } else {
          this.$message({ message: `设备刷新成功`, type: "success" });
        }
        this.$set(item, "loading", false);
      }
    }
  },
  mounted() {
    this.showDeviceStatus();
  }
};
</script>
<style lang="less" scoped>
.container-block {
  padding: 20px 20px 0 20px;
  background-color: #fff;
}
.waterfall-panel {
  width: 90%;
  margin: 0 auto;
  border-radius: 2px;
  margin-bottom: 20px;
  overflow: hidden;
  box-shadow: 0 16px 16px 0 rgba(0, 0, 0, 0.12), 0 0 16px 0 rgba(0, 0, 0, 0.04);
  > a {
    display: block;
    height: 464px;
    background-size: cover;
    background-repeat: no-repeat;
  }
  img {
    height: 464px;
  }
}
.layer {
  padding: 10px;
  h4 {
    font-size: 16px;
    margin-bottom: 5px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  > span {
    color: #9a9a9a;
    display: block;
  }
}
.status {
  margin: 5px 0;
}
</style>
