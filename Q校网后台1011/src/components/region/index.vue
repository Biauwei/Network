<template>
  <div>
    <el-cascader
      size="medium"
      :clearable="true"
      :disabled="disabled"
      :value="value"
      :options="distpickerData"
      @change="handleRegionChange"
      @input="input"
      :props="propss"
    ></el-cascader>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  name: "region",
  props: {
    value: {
      type: Array,
      default: function() {
        return [];
      }
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      propss: {
        value: "id",
        label: "name",
        children: "children"
      }
    };
  },
  computed: {
    ...mapGetters(["distpickerData"])
  },
  watch: {},
  methods: {
    input() {},
    handleRegionChange(value) {
      this.$emit("last", value);
    }
  }
};
</script>
<style lang="less" scoped>
</style>
