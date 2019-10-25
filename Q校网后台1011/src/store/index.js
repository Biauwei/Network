import Vue from 'vue';
import Vuex from 'vuex';

import tabs from './modules/tabs';
import qxuser from './modules/qxuser';
import comm from './modules/comm';
import getters from './getters';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    tabs,
    qxuser,
    comm
  },
  getters
});

export default store;
