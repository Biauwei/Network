<template>
  <div id="app">
    <router-view v-if="isRouterAlive"/>
  </div>
</template>
<script>
export default {
  name: "App",
  provide() {
    return {
      reload: this.reload
    };
  },
  data() {
    return {
      isRouterAlive: true
    };
  },
  methods: {
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(() => {
        this.isRouterAlive = true;
      });
    }
  }
};
</script>
<style lang="less">
@import "normalize.css/normalize.css";
@import "./styles/site.less";
//@import "./iconfont/iconfont.css";
</style>
