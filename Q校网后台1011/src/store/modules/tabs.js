export default {
  namespaced: true,
  state: {
    tabList: [] //打开的标签
  },
  mutations: {
    adds(state, params) {
      if (state.tabList.some(v => v.path === params.path)) {
        return false;
      }
      state.tabList.push({
        ...params
      });
    },
    del(state, params) {
      // 返回数组的迭代对象，该对象包含数组的键值对[0, "Banana"]
      let ientries = state.tabList.entries();
      for (let [i, v] of ientries) {
        if (v.path === params.path) {
          state.tabList.splice(i, 1);
          break;
        }
      }
    }
  },
  actions: {
    removes({
      commit,
      state
    }, params) {
      return new Promise(resolve => {
        commit('del', params);
        resolve([...state.tabList]);
      });
    }
  }
}
