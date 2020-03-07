import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login'
import Home from '../components/Home'
import Welcome from '../components/Welcome'
import Users from '../components/users/Users'
import Rights from '../components/power/Rights'
import Roles from '../components/power/Roles'
import Cate from '../components/goods/Cate'
import Params from '../components/goods/Params'
import List from '../components/goods/List'
import Add from '../components/goods/Add'
import Order from '../components/goods/Order'
import Report from '../components/report/Report'

Vue.use(VueRouter)

const routes = [
  // 路由重定向
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    // 子路由路由重定向
    redirect: '/welcome',
    // 子路由规则
    children: [
      {
        path: '/welcome',
        component: Welcome
      },
      {
        path: '/users',
        component: Users
      },
      {
        path: '/rights',
        component: Rights
      },
      {
        path: '/roles',
        component: Roles
      },
      {
        path: '/categories',
        component: Cate
      },
      {
        path: '/params',
        component: Params
      },
      {
        path: '/goods',
        component: List
      },
      {
        path: '/add',
        component: Add
      },
      {
        path: '/orders',
        component: Order
      },
      {
        path: '/reports',
        component: Report
      }
    ]
  }
]
const router = new VueRouter({
  mode: 'history',
  routes
})
// 挂在路由导航守卫   （路由导航守卫控制访问权限）
router.beforeEach((to, from, next) => {
  // to将要访问的路径，from代表从哪个路径跳转而来，next是一个函数表示放行
  // next用法 1.next()放行  2.next('/login')表示强制跳转
  // 如果用户要访问登录页，这里不需要权限直接放行
  if (to.path === '/login') return next()
  // 声明一个变量来储存当前的token
  const tockenStr = window.sessionStorage.getItem('token')
  // 如果当前的token值为空代表没有登录那么强制跳转到登录页
  if (!tockenStr) return next('/login')
  // 如果没有强制跳转那么就证明token存在，就直接放行
  next()
})

export default router
