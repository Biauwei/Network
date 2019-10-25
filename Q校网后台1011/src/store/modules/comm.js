import service from "@/api";

export default {
  namespaced: true,
  state: {
    distpickerData: [],
    schoolName: "",
  },
  mutations: {
    GET_DISTPICKER: (state, data) => {
      state.distpickerData = data;
    },
    GET_SCHOOLNAME: (state, name) => {
      state.schoolName = name;
    }
  },
  actions: {
    qxregion({
      commit,
      state
    }) {
      return new Promise((resolve, reject) => {
        service.findAll({}).then(res => {
          if (res.errorCode === 0) {
            commit('GET_DISTPICKER', res.data);
          }
        })
      });
    }
  }
}
