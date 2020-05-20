import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'
const userInfo = sessionStorage.getItem('userInfo')
const hasAuthority = userInfo
  ? JSON.parse(sessionStorage.getItem('userInfo')).role
  : ''
export const constantRoutes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/notice',
    component: Layout,
    meta: { title: '通知管理', icon: 'tree' },
    hidden: true,
    children: [
      {
        path: '/notice/list',
        component: () => import('@/views/AutoTest/NoticeList')
      },
      {
        path: '/notice/detail',
        component: () => import('@/views/AutoTest/NoticeDetail')
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    meta: { title: '用户管理', icon: 'tree' },
    hidden: !hasAuthority,
    children: [
      {
        path: '/user/list',
        name: 'list',
        component: () => import('@/views/AutoTest/UserList'),
        meta: { title: '用户管理' }
      },
      {
        path: '/user/detail',
        name: 'detail',
        component: () => import('@/views/AutoTest/UserDetail'),
        hidden: true
      },
      {
        path: '/user/edit',
        name: 'edit',
        component: () => import('@/views/AutoTest/UserEdit'),
        hidden: true
      },
      {
        path: '/my/center',
        name: 'center',
        component: () => import('@/views/AutoTest/MyCenter'),
        hidden: true
      }
    ]
  },
  {
    path: '/api',
    component: Layout,
    meta: { title: '接口管理', icon: 'example' },
    children: [
      {
        path: '/api/list',
        name: 'api',
        component: () => import('@/views/AutoTest/ApiList'),
        meta: { title: '接口管理' }
      },
      {
        path: '/api/detail',
        name: 'detail',
        component: () => import('@/views/AutoTest/ApiDetail'),
        hidden: true
      },
      {
        path: '/api/edit',
        name: 'edit',
        component: () => import('@/views/AutoTest/ApiEdit'),
        hidden: true
      }
    ]
  },
  {
    path: '/case',
    component: Layout,
    meta: { title: '用例管理', icon: 'form' },
    children: [
      {
        path: '/case/list',
        name: 'case',
        component: () => import('@/views/AutoTest/CaseList'),
        meta: { title: '用例管理' }
      },
      {
        path: '/case/detail',
        name: 'detail',
        component: () => import('@/views/AutoTest/CaseDetail'),
        hidden: true
      },
      {
        path: '/case/edit',
        component: () => import('@/views/AutoTest/CaseEdit'),
        hidden: true
      }
    ]
  },
  {
    path: '/operateLog',
    component: Layout,
    meta: { title: '日志管理', icon: 'table' },
    children: [
      {
        path: '/operateLog/list',
        name: 'operateLog',
        component: () => import('@/views/AutoTest/OperateLogList'),
        meta: { title: '日志管理' }
      }
    ]
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes,
    mode: 'history'
  })

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
