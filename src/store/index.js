import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    currentId: localStorage.getItem('currentId') || null,//存当前用户的id
  },
  mutations: {
    setCurrentId(state, data) {
      localStorage.setItem('currentId', data.id);
      state.currentId = data.id;
    },
    logout(state) {
      localStorage.removeItem('currentId');
      state.currentId = null;
    },
  },
  actions: {}
})
