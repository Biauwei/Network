<template>
  <el-aside id="aside" :style="{ width: width + 'px' }">
    <!-- <el-menu>
      <el-submenu index="1">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>导航一</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="1-1">选项1</el-menu-item>
          <el-menu-item index="1-2">选项2</el-menu-item>
        </el-menu-item-group>
        <el-submenu index="1-4">
          <template slot="title">选项4</template>
          <el-menu-item index="1-4-1">选项1</el-menu-item>
        </el-submenu>
      </el-submenu>
    </el-menu>-->
    <el-menu
      class="el-menu-vertical-demo"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
      router
      unique-opened
      :default-active="$route.path"
      @select="handleSelect"
      @open="handleOpen"
      @close="handleClose"
      :collapse="collapse"
      :collapse-transition="true"
    >
      <!-- 首页组件不需要后台返回 -->
      <el-menu-item index="/home">
        <i class="el-icon-menu"></i>
        <span slot="title">首页</span>
      </el-menu-item>
      <template v-for="item in menu">
        <template v-if="item.children.length >= 1">
          <el-submenu :index="item.path" :key="item.path">
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span>{{ item.name }}</span>
            </template>
            <el-menu-item-group>
              <template v-for="(ren, i) in item.children">
                <el-menu-item
                  v-if="!ren.meta.hidden"
                  :index="ren.path"
                  :key="i"
                >{{ ren.meta.title }}</el-menu-item>
              </template>
            </el-menu-item-group>
          </el-submenu>
        </template>
        <template v-else>
          <el-menu-item :index="item.path" :key="item.index">
            <i class="el-icon-menu"></i>
            <span slot="title">{{ item.name }}</span>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </el-aside>
</template>
<script>
import { mapGetters } from "vuex";
import bus from "@/utils/bus";
export default {
  name: "asides",
  inject: ["reload"], //注入依赖
  data() {
    return {
      width: 200,
      collapse: false
    };
  },
  computed: {
    ...mapGetters(["menu"])
  },
  methods: {
    handleOpen() {},
    handleClose() {},
    handleSelect(index, indexPath) {
      if (this.$route.path === index) {
        console.log(index);
      }
    }
  },
  mounted() {
    bus.$on("collapse", msg => {
      this.collapse = msg;
      return this.collapse ? (this.width = 64) : (this.width = 200);
    });
  }
};
</script>
<style lang="less" scoped>
#aside {
  transition: width 0.6s;
  background-color: #545c64;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
</style>
