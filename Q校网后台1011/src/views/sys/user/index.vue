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
          <el-form-item label="学校名称">
            <el-input v-model.trim="query.schoolName" placeholder="请输入学校名称" maxlength="40"></el-input>
          </el-form-item>
          <el-form-item label="账号名称">
            <el-input v-model.trim="query.userName" placeholder="请输入账号" maxlength="40"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-search" type="primary" @click="handleSearch">查询</el-button>
            <el-button icon="el-icon-plus" type="primary" @click="dialogAdd = true">新增账号</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="page-bd">
      <!-- 表格数据 -->
      <template>
        <el-table :data="tableData" style="width: 100%" size="small">
          <el-table-column label="用户ID" prop="accountId" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column label="账号" prop="userName" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span
                style="color:#409EFF;cursor:pointer;"
                @click="handleViewInfo(scope.row)"
              >{{ scope.row.userName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="用户角色" prop="roleName" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column label="负责人" prop="masterName" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column label="负责人电话" prop="masterPhone" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column label="所属学校" prop="name" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column label="添加时间" prop="postTime" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column label="账号状态" prop="status" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.status"
                :width="35"
                :active-value="0"
                inactive-value="1"
                active-color="#13ce66"
                inactive-color="#ff4949"
                @change="handleSwitch(scope.row)"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" prop :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="handleReset(scope.row)">重置密码</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
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

    <template>
      <el-dialog top="40px" title="新增账号" :visible.sync="dialogAdd">
        <el-form
          :rules="rules"
          ref="form"
          :model="form"
          status-icon
          size="small"
          :label-width="formLabelWidth"
          label-position="left"
        >
          <el-form-item label="账号" prop="userName" ref="userName">
            <el-input v-model="form.userName" placeholder="请输入账号名称"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input type="password" v-model="form.password" placeholder="请输入密码"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="checkPass">
            <el-input type="password" v-model="form.checkPass" placeholder="请确认密码"></el-input>
          </el-form-item>
          <el-form-item label="用户角色" prop="roleId">
            <el-select v-model="form.roleId" placeholder="选择用户角色">
              <el-option
                v-for="item in roleList"
                :key="item.roleId"
                :label="item.roleName"
                :value="item.roleId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="账户类型" prop="type">
            <el-select v-model="form.type" placeholder="选择账户类型" @change="handleType">
              <el-option
                v-for="item in typeList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <template v-if="form.type === 1">
            <el-form-item label="区域选择" prop="regionId" ref="region">
              <qx-region @last="lastChange" v-model="form.regionId"></qx-region>
            </el-form-item>
          </template>
          <template v-else>
            <el-form-item label="区域选择" prop="regionId" ref="region">
              <qx-region-t @regionChange="handleRegionChanges"></qx-region-t>
            </el-form-item>
          </template>
          <template v-if="form.type === 1">
            <el-form-item label="对应学校" prop="schoolId">
              <el-select
                v-model="form.schoolId"
                placeholder="选择学校"
                @change="handleSchool"
                :disabled="disabled === 1"
              >
                <el-option
                  v-for="item in schoolList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </template>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="dialogAdd = false">取消</el-button>
          <el-button size="small" @click="handleResetRegion">重置</el-button>
          <el-button size="small" type="primary" @click="submitForm('form')">确定</el-button>
        </span>
      </el-dialog>
    </template>
    <!-- 查看用户信息 -->
    <template>
      <el-dialog top="40px" title="查看用户信息" :visible.sync="dialogView">
        <el-row :gutter="10" type="flex" class="row-bg">
          <div class="one"></div>
          <div class="two">
            <div class="list">
              <p>
                账号名称：
                <span>{{ info.userName }}</span>
              </p>
              <p>
                用户角色：
                <span>{{ info.roleName }}</span>
              </p>
              <p>
                负责人：
                <span>{{ info.masterName }}</span>
              </p>
              <p>
                负责人电话：
                <span>{{ info.masterPhone }}</span>
              </p>
              <p>
                所属学校：
                <span>{{ info.name }}</span>
              </p>
              <p>
                所属区域：
                <span>{{ info.provinceCityRegion }}</span>
              </p>
              <p>
                账号状态：
                <span v-if="info.status === 0">正常</span>
                <span v-else style="color:#F56C6C;">停用</span>
              </p>
            </div>
          </div>
        </el-row>
      </el-dialog>
    </template>
    <!-- 重置密码 -->
    <template>
      <el-dialog top="40px" title="重置密码" :visible.sync="dialogReset">
        <el-form
          :rules="rules2"
          ref="reset"
          :model="reset"
          status-icon
          size="small"
          :label-width="formLabelWidth"
          label-position="left"
        >
          <el-form-item label="学校名称" prop="name">
            <el-input v-model="reset.name" disabled></el-input>
          </el-form-item>
          <el-form-item label="账号" prop="userName">
            <el-input v-model="reset.userName" disabled></el-input>
          </el-form-item>
          <el-form-item label="输入新密码" prop="password">
            <el-input type="password" v-model="reset.password" placeholder="输入新密码"></el-input>
          </el-form-item>
          <el-form-item label="确认新密码" prop="checkPass">
            <el-input type="password" v-model="reset.checkPass" placeholder="确认新密码"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="dialogReset = false">取消</el-button>
          <el-button size="small" type="primary" @click="resetForm('reset')">确定</el-button>
        </span>
      </el-dialog>
    </template>
  </div>
</template>
<script>
import service from "@/api";
import region from "@/components/region";
import regiont from "@/components/qxregion";
import { accountType } from "@/mixins";
import pageMixins from "@/mixins/page";
export default {
  name: "account",
  inject: ["reload"], //注入依赖
  mixins: [accountType, pageMixins],
  components: {
    "qx-region": region,
    "qx-region-t": regiont
  },
  data() {
    let checkUserName = async (rule, value, callback) => {
      let res = await service.queryAccountName({ userName: value });
      if (res.errorCode === 0) {
        callback();
      } else {
        callback(new Error(`${res.errorMsg}`));
      }
    };
    let checkPass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== (this.form.password || this.reset.password)) {
        callback(new Error("两次输入密码不一致!"));
      }
      callback();
    };
    return {
      dialogAdd: false,
      dialogReset: false,
      dialogView: false,
      disabled: 0,
      info: {},
      query: {
        schoolName: "",
        userName: ""
      },
      form: {
        queryType: null,
        queryId: null,
        password: "",
        type: 0,
        regionId: null
      },
      reset: {
        accountId: null,
        name: "",
        password: ""
      },
      rules: {
        userName: [
          { required: true, message: "请输入账号名称", trigger: "blur" },
          { validator: checkUserName, trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        checkPass: [{ validator: checkPass, trigger: "blur" }],
        roleId: [{ required: true, message: "选择用户角色", trigger: "blur" }],
        type: [{ required: true, message: "选择用户类型", trigger: "blur" }],
        regionId: [
          { required: true, message: "选择对应区域", trigger: "blur" }
        ],
        schoolId: [{ required: true, message: "选择学校", trigger: "blur" }]
      },
      rules2: {
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        checkPass: [{ required: true, validator: checkPass, trigger: "blur" }]
      },
      schoolList: [],
      roleList: []
    };
  },
  computed: {
    computedPage() {
      return this.tableData.slice(
        (this.page - 1) * this.page_size,
        this.page * this.page_size
      );
    }
  },
  methods: {
    handleResetRegion() {
      this.$refs.userName.resetField();
      this.$refs.region.resetField();
    },
    handleCurrentChange(curr) {
      this.query.page = curr;
      this.queryAccount();
    },
    handleSizeChange(size) {
      this.query.pageSize = size;
      this.queryAccount();
    },
    handleSearch() {
      this.queryAccount();
    },
    handleViewInfo(row) {
      this.info = Object.assign({}, row, { provinceCityRegion: "" });
      this.queryAccountInfo(row.accountId);
    },
    handleRegionChange(queryId, queryType) {
      this.query.queryId = queryId;
      this.query.queryType = queryType;
    },
    handleRegionChanges(queryId, queryType) {
      this.form.queryId = queryId;
      this.form.queryType = queryType;
      this.form.regionId = queryId;
      this.queryRegion(queryId, queryType);
    },
    handleType(value) {
      if (value !== 1) {
        this.disabled = 1;
      } else {
        this.disabled = 0;
      }
    },
    handleSchool(value) {
      this.form.schoolId = value;
    },
    handleSwitch(row) {
      let { status, accountId } = row;
      this.changeStatus({ accountId, status: status ? 1 : 0 });
    },
    handleReset(row) {
      let { userName, name, accountId } = row;
      this.dialogReset = true;
      this.reset = Object.assign({}, { userName, name, accountId });
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let { regionId, queryId, queryType, checkPass, ...args } = this.form;
          if (Array.isArray(regionId)) {
            queryId = regionId[regionId.length - 1]; //区域ID
            queryType = 2;
          }
          let obj = Object.assign({}, args, { queryId, queryType });
          this.addAccount(obj);
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let { accountId, password, userName } = this.reset;
          this.resetPassword({ accountId, password, userName });
        } else {
          return false;
        }
      });
    },
    //加载学校数据
    async queryRegion(queryId, queryType) {
      if (queryType === 2) {
        queryType = 3;
        let res = await service.queryRegion({ queryId, queryType });
        if (res.errorCode === 0) {
          this.schoolList = res.data;
        } else {
          return false;
        }
      }
    },
    async lastChange(value) {
      this.form.regionId = value;
      let last = value[value.length - 1];
      let res = await service.queryRegion({ queryId: last, queryType: 3 });
      if (res.errorCode === 0) {
        this.schoolList = res.data;
      } else {
        return false;
      }
    },
    //检查用户名是否重复
    async queryAccountName(params = {}) {
      let res = await service.queryAccountName(params);
    },
    //用户角色
    async queryRoleName(params = {}) {
      let res = await service.queryRoleName(params);
      if (res.errorCode === 0) {
        this.roleList = res.data;
      }
    },
    //新增用户账号
    async addAccount(params = {}) {
      let res = await service.addAccount(params);
      if (res.errorCode === 0) {
        this.dialogAdd = false;
        this.$refs.form.resetFields();
        this.queryAccount();
      }
    },
    //重置密码
    async resetPassword(params = {}) {
      let res = await service.resetPassword(params);
      if (res.errorCode === 0) {
        this.dialogReset = false;
      }
    },
    //修改账号状态
    async changeStatus({ accountId, status }) {
      let res = await service.changeStatus({ accountId, status });
      if (res.errorCode === 0) {
      }
    },
    //用户列表
    async queryFuzzy() {
      let res = await service.queryFuzzy(this.query);
      if (res.errorCode === 0) {
        this.tableData = res.data.data;
        this.totalCount = res.data.totalCount;
      }
    },
    //测试-查询用户
    async queryAccount() {
      let res = await service.query(this.query);
      if (res.errorCode === 0) {
        this.tableData = res.data.data;
        this.totalCount = res.data.totalCount;
      }
    },
    //查看用户信息
    async queryAccountInfo(accountId) {
      let res = await service.queryAccountInfo({ accountId });
      if (res.errorCode === 0) {
        this.dialogView = true;
        this.info.provinceCityRegion = res.data.provinceCityRegion;
      }
    }
  },
  activated() {
    this.queryAccount();
    this.queryRoleName();
  },
  mounted() {
    //this.queryFuzzy();
  }
};
</script>
<style lang="less" scoped>
.row-bg {
  > div {
    margin: 0 15px;
  }
  .two {
    flex: 1;
  }
}
.list {
  font-size: 14px;
  margin-bottom: 50px;
  color: #333;
  p {
    padding: 8px 0;
    border-bottom: 1px solid rgba(220, 223, 230, 0.5);
  }
  span {
    color: #409eff;
    line-height: 1.6;
  }
}
</style>
