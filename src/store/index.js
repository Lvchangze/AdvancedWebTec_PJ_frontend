import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    // currentJob: localStorage.getItem('currentJob') || null,//存职业，0为主治医生，1为急诊医生，2为护士长，3为病房护士
    // currentId: localStorage.getItem('currentId') || null,//存该职业下的id
    // modifyStaffId: localStorage.getItem('modifyStaffId') || null,//要修改的员工的id
    // modifyPatientId: localStorage.getItem('modifyPatientId') || null//要修改的病人的id
  },
  mutations: {
    // setCurrentUser(state, data) {
    //   localStorage.setItem('currentJob', data.job);
    //   localStorage.setItem('currentId', data.id);
    //   state.currentJob = data.job;
    //   state.currentId = data.id;
    // },
    //
    // logout(state){
    //   localStorage.removeItem('currentJob');
    //   localStorage.removeItem('currentId');
    //   state.currentJob = null;
    //   state.currentId = null;
    // },
    //
    // setModifyTarget(state, data){
    //   localStorage.setItem('modifyStaffId', data)
    //   state.modifyStaffId = data;
    // },
    //
    // setModifyPatientId(state, data){
    //   localStorage.setItem('modifyPatientId', data)
    //   state.modifyPatientId = data;
    // },
  },
  actions: {}
})
