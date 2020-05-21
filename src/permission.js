// import router, { asyncRoutes } from './router'
// import NProgress from 'nprogress' // progress bar
// import 'nprogress/nprogress.css' // progress bar style

// NProgress.configure({ showSpinner: false }) // NProgress Configuration

// router.beforeEach(async(to, from, next) => {
//   const userInfo = sessionStorage.getItem('userInfo')
//   const hasAuthority = userInfo
//     ? JSON.parse(sessionStorage.getItem('userInfo')).role
//     : ''
//   if (localStorage.token) {
//     // router.addRoutes(asyncRoutes)
//     // asyncRoutes.push({ path: '*', redirect: '/404', hidden: true })
//     // router.options.routes = asyncRoutes
//     // next()
//     // next({ ...to, replace: true })
//   }
// })
// router.afterEach(() => {
//   // finish progress bar
//   NProgress.done()
// })
