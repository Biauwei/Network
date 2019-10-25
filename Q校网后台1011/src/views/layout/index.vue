<template>
  <div class="wrapper">
    <!-- <el-container class="is-vertical" style="height:100vh;">
      <qx-header></qx-header>
      <el-container style="overflow: auto;">
        <qx-aside></qx-aside>
        <el-main id="main">
          <qx-tabs></qx-tabs>
          <transition name="fade-transform" mode="out-in">
            <keep-alive>
              <router-view :key="$route.fullPath" />
            </keep-alive>
          </transition>
        </el-main>
      </el-container>
    </el-container>-->
    <el-container style="height:100vh;">
      <!-- 主体 侧边栏 -->
      <qx-aside></qx-aside>
      <el-container class="is-vertical">
        <!-- 主体 顶栏 -->
        <qx-header></qx-header>
        <!-- 主体 内容 -->
        <el-main id="main">
          <qx-tabs></qx-tabs>
          <transition name="fade-transform" mode="out-in">
            <keep-alive>
              <router-view :key="$route.fullPath" />
            </keep-alive>
          </transition>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
import qxheader from "./components/headers";
import qxaside from "./components/asides";
import qxtabs from "./components/tabs";

export default {
  name: "layout",
  components: {
    "qx-header": qxheader,
    "qx-aside": qxaside,
    "qx-tabs": qxtabs
  }
};
</script>
<style lang="less" scoped>
#main {
  position: relative;
  padding: 0 !important;
  display: flex;
  flex-direction: column;
  background-color: #f0f2f5;
}
</style>
