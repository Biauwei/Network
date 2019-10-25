<template>
  <div class="tabs-contaier">
    <router-link v-for="tab in tabList" :key="tab.path" :to="tab.path">
      {{ tab.meta.title }}
      <template v-if="tab.path !== '/home'">
        <i class="el-icon-close" @click.prevent.stop="removeAction(tab)"></i>
      </template>
    </router-link>
  </div>
</template>
<script>
//在组件中分发 Action
import { mapState, mapActions } from "vuex";
import bus from "@/utils/bus";
export default {
  name: "tabs",
  data() {
    return {
      left: 200
    };
  },
  watch: {
    $route(news, old) {
      return this.$store.commit("tabs/adds", this.$route);
    }
  },
  computed: {
    ...mapState("tabs", ["tabList"])
  },
  methods: {
    ...mapActions("tabs", ["removes"]),
    removeAction(tab) {
      this.removes(tab).then(res => {
        if (tab.path === this.$route.path) {
          const latestView = res.slice(-1)[0];
          if (latestView) {
            this.$router.push(latestView);
          } else {
            this.$router.push({ path: "/" });
          }
        }
      });
    }
  },
  mounted() {
    bus.$on("collapse", msg => {});
    return this.$store.commit("tabs/adds", this.$route);
  }
};
</script>
<style lang="less" scoped>
.tabs-contaier {
  position: fixed;
  //left: 200px;
  top: 60px;
  z-index: 990;
  width: 100%;
  display: flex;
  background-color: #fff;
  // box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid #ebf1f6;
  a {
    display: flex;
    align-items: center;
    position: relative;
    min-height: 40px;
    min-width: 50px;
    padding: 0 10px;
    color: #909399;
    font-size: 13px;
    border-right: 1px solid #f6f6f6;
    i {
      display: inline-block;
      margin-left: 5px;
    }
    &.router-link-exact-active {
      color: #333;
      background-color: #f0f2f5;
      &::after {
        content: "";
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 2px;
        background-color: #409eff;
      }
    }
  }
}
</style>
