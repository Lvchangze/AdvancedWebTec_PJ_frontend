import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/Login'
import Register from '../components/Register'
import Main from '../components/Main'

Vue.use(Router)

export const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/Login',
      name: 'login',
      component: Login
    },
    {
      path: '/register',
      name: 'Register',
      component: Register,
    },
    {
      path: '/Main',
      name: 'Main',
      component: Main,
      // children: [
      //   {
      //     path: '/Search',
      //     name: 'Search',
      //     component: Search,
      //   },
      // ]
    },
  ]
})
