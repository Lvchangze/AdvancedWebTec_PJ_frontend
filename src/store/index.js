import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    Authorization: localStorage.getItem('Authorization') || null,//存token
    currentId: localStorage.getItem('currentId') || null,//存当前用户的id
  },
  mutations: {
    changeLogin (state, data) {
      localStorage.setItem('currentId', data.id);
      state.currentId = data.id;
      localStorage.setItem('Authorization', data.token);
      state.Authorization = data.token;
    },
    logout(state) {
      localStorage.removeItem('currentId');
      localStorage.removeItem('Authorization');
      state.currentId = null;
      state.Authorization = null;
    },
  },
  actions: {}
})
