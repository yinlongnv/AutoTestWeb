import request from "@/utils/request";
let userInfo = sessionStorage.getItem("userInfo");
let userId = userInfo ? JSON.parse(sessionStorage.getItem("userInfo")).id : "";
// 导出全部日志
export function exportAllLogs(data) {
  return request({
    url: "/operateLog/exportAllLogs",
    method: "get",
    params: { ...data, userId }
  });
}
// 获取全部用户名下拉筛选框
export function getfilterUserName(data) {
  return request({
    url: "/operateLog/filterUserName",
    method: "get",
    params: data
  });
}
