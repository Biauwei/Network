export default {
  data() {
    return {
      query: {
        page: 1,
        pageSize: 20
      },
      isShow: false, //判断dialog弹窗是新增还是编辑
      formLabelWidth: "100px",
      dialogFormVisible: false,
      tableData: [], //通用数据表格
      totalCount: 0 //分页总数
    }
  }
}
