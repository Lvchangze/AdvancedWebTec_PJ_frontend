import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/Login'
import Register from '../components/Register'
import Main from '../components/Main'
import VirtualScene from "../components/VirtualScene"
import UserInfo from "../components/UserInfo"
import Sign from "../components/Sign";

Vue.use(Router);

export const router = new Router({
  // mode: 'history',
  routes: [
    {
      path:'',
      component:Sign,
      children:[
        {
          path:'',
          redirect:'login'
        },
        {
          path:'login',
          component:Login
        },
        {
          path:'register',
          component:Register
        }
      ]

    },
    {
      path: '/',
      redirect:'/Login'
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
      path: '/VirtualScene',
      name: 'VirtualScene',
      component: VirtualScene,
    },
    {
      path: '/UserInfo',
      name: 'UserInfo',
      component: UserInfo,
    },
    {
      path: '/Main',
      name: 'Main',
      component: Main,
      meta: {
        requireAuth: true, // 需要登录权限
      },
    },
  ]
})

// 导航守卫，使用 router.beforeEach 注册一个全局前置守卫，判断用户是否登陆
router.beforeEach((to, from, next) => {
  if (to.path === '/login' || to.path === '/register') {
    next();
  } else {
    let token = localStorage.getItem('Authorization');
    if (token) {//token存在
      next();
    } else {
      //token不存在先注释了,避免乱跳
      // next('/login');
      next()
    }
  }
});
