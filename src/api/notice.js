import request from "@/utils/request";
let userInfo = sessionStorage.getItem("userInfo");
let userId = userInfo ? JSON.parse(sessionStorage.getItem("userInfo")).id : "";
// 获取当前登录用户的所有通知公告列表，支持时间段筛选
export function listWithSearch(data) {
  return request({
    url: "/notice/listWithSearch",
    method: "get",
    params: { userId, ...data }
  });
}
// 将当前用户所有的通知公告标记为已读
export function markReadAll(data) {
  return request({
    url: "/notice/markReadAll",
    method: "get",
    params: { userId, ...data }
  });
}
// 点击通知公告查看通知公告详情
export function detail(data) {
  return request({
    url: "/notice/detail",
    method: "get",
    params: { userId, ...data }
  });
}
