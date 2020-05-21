import router, { asyncRoutes } from "./router";
import NProgress from "nprogress"; // progress bar
import "nprogress/nprogress.css"; // progress bar style

NProgress.configure({ showSpinner: false }); // NProgress Configuration

router.beforeEach(async (to, from, next) => {
  const userInfo = sessionStorage.getItem("userInfo");
  const hasAuthority = userInfo
    ? JSON.parse(sessionStorage.getItem("userInfo")).role
    : "";
  if (hasAuthority) {
    router.options.routes = asyncRoutes;
    console.log(hasAuthority, asyncRoutes);
  }
  next();
});
router.afterEach(() => {
  // finish progress bar
  NProgress.done();
});
