import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/Login'
import Register from '../components/Register'
import Try from '../components/Try'

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
      path: '/try',
      name: 'Try',
      component: Try,
    },
    // {
    //   path: '/Main',
    //   name: 'Main',
    //   component: Main,
    //   redirect: 'Search',
    //   children: [
    //     {
    //       path: '/Search',
    //       name: 'Search',
    //       component: Search,
    //     },
    //   ]
    // },
  ]
})
