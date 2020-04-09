import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
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
    path: '/user',
    component: Layout,
    meta: { title: '用户管理', icon: 'dashboard' },
    children: [
      {
        path: '/user/list',
        name: 'list',
        component: () => import('@/views/AutoTest/UserManage'),
        meta: { title: '用户列表', icon: 'dashboard' }
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
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/analyse',
    component: Layout,
    children: [
      {
        path: '',
        name: 'analyse',
        component: () => import('@/views/Analyse/index'),
        meta: { title: '数据分析', icon: 'dashboard' }
      }
    ]
  },
  {
    path: '/old',
    component: Layout,
    children: [
      {
        path: '',
        name: 'old',
        component: () => import('@/views/OldManage/index'),
        meta: { title: '老人管理', icon: 'dashboard' }
      }
    ]
  },

  {
    path: '/service',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'service',
        component: () => import('@/views/Service/index'),
        meta: { title: '服务人员', icon: 'dashboard' }
      }
    ]
  },

  {
    path: '/history',
    component: Layout,
    children: [
      {
        path: '',
        component: () => import('@/views/History/index'), // Parent router-view
        name: 'history',
        meta: { title: '服务历史', icon: 'dashboard' }
      }
    ]
  },

  {
    path: '/project',
    component: Layout,
    children: [
      {
        path: '',
        component: () => import('@/views/ProjectManage/index'), // Parent router-view
        name: 'project',
        meta: { title: '服务项目管理', icon: 'dashboard' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
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
