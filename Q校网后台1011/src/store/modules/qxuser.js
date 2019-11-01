import service from "@/api";
import {
  getToken,
  setToken,
  removeToken
} from "@/utils/auth";

export default {
  namespaced: true,
  state: {
    token: getToken(),
    name: "",
    type: null, //账号类型 0-促进会 1-学校 2-教育局 3-培训机构
    scopeId: null,
    scopeType: null, // 0省 1市 2区 5admin
    schoolId: null, //微信端学校ID
    menu: []
  },
  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token;
    },
    SET_TYPE: (state, type) => {
      state.type = type;
    },
    SET_SCOPEID: (state, scopeId) => {
      state.scopeId = scopeId;
    },
    SET_SCOPETYPE: (state, scopeType) => {
      state.scopeType = scopeType;
    },
    SET_NAME: (state, name) => {
      state.name = name;
    },
    SET_MENU: (state, menu) => {
      state.menu = menu;
    },
    SET_SCHOOLID: (state, schoolId) => {
      state.schoolId = schoolId;
    }
  },
  actions: {
    // 用户名登录
    qxLoginByUsername({
      commit
    }, userInfo) {
      return new Promise((resolve, reject) => {
        service.login(userInfo).then(res => {
          if (res.errorCode === 0) {
            commit('SET_TOKEN', res.data.Authorization);
            setToken(res.data.Authorization);
            resolve(res);
          } else {
            resolve(res);
          }
        }).catch(error => {
          reject(error);
        })
      })
    },
    //获取用户权限菜单，登陆后的操作
    querySystemMenus({
      commit,
      state
    }) {
      return new Promise((resolve, reject) => {
        service.querySystemMenus({}).then(res => {
          if (res.errorCode === 0) {
            if (res.data.router) {
              commit('SET_NAME', res.data.name);
              commit('SET_TYPE', res.data.type);
              commit('SET_SCOPEID', res.data.scopeId);
              commit('SET_SCOPETYPE', res.data.scopeType);
              commit('SET_MENU', res.data.router);
              commit('SET_SCHOOLID', res.data.schoolId);
            }
            resolve(res);
          } else if (res.errorCode === -1) {
            commit('SET_TOKEN', '')
            removeToken();
            location.reload();
          }
        }).catch(error => {
          reject(error);
        })
      });
    },
    // 登出
    qxLogout({
      commit,
      state
    }) {
      return new Promise((resolve, reject) => {
        service.logout({}).then(res => {
          if (res.errorCode === 0) {
            commit('SET_TOKEN', '')
            removeToken();
            resolve(res);
          } else {
            resolve(res);
          }
        }).catch(error => {
          reject(error);
        })
      });
    }
  }
}
