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
          <el-form-item label="奖励类型">
            <el-select v-model="query.prizeType" placeholder="请选择">
              <el-option
                v-for="item in prizeTypelList"
                :key="item.id"
                :value="item.id"
                :label="item.name"
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
      <base-table :data="tableData" :columns="columns">
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDel(scope.row.itemId)">删除</el-button>
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
    <el-dialog top="40px" :visible.sync="dialogFormVisible">
      <span slot="title" class="dialog-title">{{ isShow ? '新增': '编辑' }}</span>
      <el-form ref="form" :model="form" status-icon size="small" :label-width="formLabelWidth">
        <el-form-item
          label="奖项名称"
          prop="textContent"
          :rules="[
          { required: true, message: '请输入奖项名称', trigger: 'blur' }
        ]"
        >
          <el-input v-model="form.textContent" placeholder="请输入奖项名称"></el-input>
        </el-form-item>
        <el-form-item
          label="兑换数量"
          prop="starCount"
          :rules="[
          { required: true, message: '请输入兑换数量', trigger: 'blur' }
        ]"
        >
          <el-input type="number" v-model="form.starCount" placeholder="请输入兑换数量"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="submitForm('form')">提交</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import service from "@/api";
import QTable from "@/components/QTable";
export default {
  name: "",
  components: {
    "base-table": QTable
  },
  data() {
    return {
      dialogFormVisible: false,
      isShow: false, //判断dialog弹窗是新增还是编辑
      formLabelWidth: "100px",
      columns: [
        {
          label: "序号",
          prop: "itemId"
        },
        {
          label: "奖项名称",
          prop: "textContent"
        },
        {
          label: "兑换Q星数",
          prop: "starCount"
        }
      ],
      prizeTypelList: [
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
        prizeType: 0,
        page: 1,
        pageSize: 20
      },
      form: {
        textContent: "",
        starCount: null
      },
      tableData: [],
      totalCount: 0
    };
  },
  methods: {
    handleSearch() {
      this.queryPrizeDefual(this.query);
    },
    handleCurrentChange(curr) {
      this.query.page = curr;
      this.queryPrizeDefual(this.query);
    },
    handleSizeChange(size) {
      this.query.pageSize = size;
      this.queryPrizeDefual(this.query);
    },
    handleAdd() {
      this.form = {};
      this.isShow = true;
      this.dialogFormVisible = true;
    },
    handleEdit(row) {
      this.isShow = false;
      this.dialogFormVisible = true;
      this.form = Object.assign({}, row);
    },
    handleDel(itemId) {
      this.$confirm(`确定删除吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.deletePrize(itemId);
        })
        .catch(error => {
          return false;
        });
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.isShow) {
            this.addPrize(this.form);
          } else {
            this.updatePrize(this.form);
          }
        }
      });
    },
    //查询所有奖项
    async queryPrizeDefual(params = {}) {
      let res = await service.queryPrizeDefual(params, {
        headers: { "Content-Type": "application/json" }
      });
      if (res.errorCode === 0) {
        this.tableData = res.data.data;
        this.totalCount = res.data.totalCount;
      }
    },
    //编辑奖项
    async updatePrize(params = {}) {
      let res = await service.updatePrize(params, {
        headers: { "Content-Type": "application/json" }
      });
      if (res.errorCode === 0) {
        this.dialogFormVisible = false;
        this.$refs.form.resetFields();
        this.queryPrizeDefual(this.query);
      }
    },
    //删除奖项
    async deletePrize(itemId) {
      let res = await service.deletePrize(
        { itemId },
        {
          headers: { "Content-Type": "application/json" }
        }
      );
      if (res.errorCode === 0) {
        this.queryPrizeDefual(this.query);
      }
    },
    //新增奖项
    async addPrize(params = {}) {
      let res = await service.addPrize(params, {
        headers: { "Content-Type": "application/json" }
      });
      if (res.errorCode === 0) {
        this.dialogFormVisible = false;
        this.$refs.form.resetFields();
        this.queryPrizeDefual(this.query);
      }
    }
  },
  mounted() {
    this.queryPrizeDefual(this.query);
  }
};
</script>
<style lang="less" scoped>
</style>
