// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import {router} from './router'
import store from './store'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(Element)

import axios from 'axios'

Vue.prototype.$axios = axios
axios.defaults.baseURL = '/api'
axios.defaults.withCredentials = true;
axios.defaults.headers.post['Content-Type'] = "application/json;charset=UTF-8";

//http 请求 拦截器
axios.interceptors.request.use(
  config => {
    console.log("store.state.Authorization: " + store.state.Authorization)
    if (store.state.Authorization) {
      config.headers.Authorization = 'Bearer ' + store.state.Authorization;
      console.log(config)
    }
    return config;
  },
  error => {
    console.log(error)
    return Promise.reject(error);
  });

axios.interceptors.response.use(
  response => {
    if (response.data.hasOwnProperty("state")) {
      const stateCode = response.data.state;
      if (stateCode === 401) {
        router.replace('/login')
      }
    }
    return response
  },
)

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {App},
  template: '<App/>'
})
