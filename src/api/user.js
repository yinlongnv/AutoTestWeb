import request from "@/utils/request";
export function createUser(data) {
  return request({
    url: "/user/createOrEdit",
    method: "post",
    data
  });
}
// 用户管理
export function deleteUsers(data) {
  return request({
    url: "/user/delete",
    method: "post",
    data
  });
}
export function enableUsers(data) {
  return request({
    url: "/user/enable",
    method: "post",
    data
  });
}
export function disableUsers(data) {
  return request({
    url: "/user/disable",
    method: "post",
    data
  });
}
// 日志管理

// 接口管理——url待修改
export function deleteApis(data) {
  return request({
    url: "/user/delete",
    method: "post",
    data
  });
}
// 用例管理
export function deleteCases(data) {
  return request({
    url: "/user/delete",
    method: "post",
    data
  });
}
// export function login(data) {
//   return request({
//     url: '/vue-admin-template/user/login',
//     method: 'post',
//     data
//   })
// }

// export function getInfo(token) {
//   return request({
//     url: '/vue-admin-template/user/info',
//     method: 'get',
//     params: { token }
//   })
// }

// export function logout() {
//   return request({
//     url: '/vue-admin-template/user/logout',
//     method: 'post'
//   })
// }

export function login(data) {
  return request({
    url: "/user/login",
    method: "post",
    data
  });
}
