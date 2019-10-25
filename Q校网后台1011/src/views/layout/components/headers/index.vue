<template>
  <el-header id="header">
    <div class="head-container">
      <div class="toggle-aside" @click="collapseChage">
        <i class="el-icon-menu"></i>
      </div>
      <el-dropdown @command="handleCommand">
        <span class="el-dropdown-link">
          {{ name }}
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </el-header>
</template>
<script>
import bus from "@/utils/bus";
//在组件中分发 Action
import { mapGetters } from "vuex";

export default {
  name: "headers",
  data() {
    return {
      collapse: false
    };
  },
  computed: {
    ...mapGetters(["name", "type"])
  },
  methods: {
    collapseChage() {
      this.collapse = !this.collapse;
      bus.$emit("collapse", this.collapse);
    },
    handleCommand(command) {
      this.$confirm(`确定退出登陆吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$store.dispatch("qxuser/qxLogout").then(res => {
            if (res.errorCode === 0) {
              location.reload();
            }
          });
        })
        .catch(error => {
          return false;
        });
    }
  }
};
</script>
<style lang="less" scoped>
.head-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
}
#header {
  // height: 60px;
  border-bottom: 1px solid #f6f6f6;
  background-color: #ebf1f6;
  .toggle-aside {
    cursor: pointer;
    i {
      font-size: 26px;
      color: #606266;
    }
  }
}
.tabs {
  color: #fff;
  background-color: #606266;
}
</style>
