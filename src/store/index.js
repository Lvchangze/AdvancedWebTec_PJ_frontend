import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    Authorization: localStorage.getItem('Authorization') || null,//存token
    currentId: localStorage.getItem('currentId') || null,//存当前用户的id
    socketConn: null,//存当前用户的websocket
  },
  getters: {
    getSocketConn(state){
      return state.socketConn
    },
    getCurrentId(state){
      return state.currentId
    }
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
      localStorage.removeItem('socketConn');
      state.currentId = null;
      state.Authorization = null;
      state.socketConn = null;
    },
    webSocketConnect(state){
      state.socketConn = new WebSocket("ws://localhost:8080/conn")
    }
  },
  actions: {}
})
