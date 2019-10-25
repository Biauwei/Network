<template>
  <el-table :data="data" size="small">
    <template v-for="(column, index) in columns">
      <el-table-column :show-overflow-tooltip="true" :key="index" v-bind="column || {}">
        <!-- <template slot-scope="scope">
              <span v-if="column.slot">
                <slot :name="column.slot" :scope="scope"/>
              </span>
              <span v-else>{{ scope.row[column.prop] }}</span>
        </template>-->
      </el-table-column>
    </template>
    <slot></slot>
  </el-table>
</template>
<script>
export default {
  name: "base-table",
  props: {
    data: {
      type: Array,
      default: () => []
    },
    columns: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  computed: {
    tableHeight() {
      return window.innerHeight - 255;
    }
  },
  data() {
    return {};
  }
};
</script>
<style lang="less" scoped>
</style>
