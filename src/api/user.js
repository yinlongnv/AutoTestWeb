import request from "@/utils/request";
let userInfo = sessionStorage.getItem("userInfo");
let userId = userInfo ? JSON.parse(sessionStorage.getItem("userInfo")).id : "";
// 用户登录
export function login(data) {
  return request({
    url: "/user/login",
    method: "post",
    data
  });
}
// 创建/编辑用户信息
export function createUser(data) {
  return request({
    url: "/user/createOrEdit",
    method: "post",
    data: { userId, ...data }
  });
}
// (批量)删除用户
export function deleteUsers(data) {
  return request({
    url: "/user/delete",
    method: "post",
    data: { userId, ...data }
  });
}
// (批量)启用用户
export function enableUsers(data) {
  return request({
    url: "/user/enable",
    method: "post",
    data: { userId, ...data }
  });
}
// (批量)禁用用户
export function disableUsers(data) {
  return request({
    url: "/user/disable",
    method: "post",
    data: { userId, ...data }
  });
}
// 根据id获取用户详情信息
export function getUserDetail(data) {
  return request({
    url: "/user/detail",
    method: "get",
    params: { ...data, userId }
  });
}
