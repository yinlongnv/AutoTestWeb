import request from "@/utils/request";
let userInfo = sessionStorage.getItem("userInfo")
let userId = userInfo?JSON.parse(sessionStorage.getItem("userInfo")).id:''
export function login(data) {
  return request({
    url: "/user/login",
    method: "post",
    data
  });
}
export function createUser(data) {
  return request({
    url: "/user/createOrEdit",
    method: "post",
    data: { userId, ...data }
  });
}
export function deleteUsers(data) {
  return request({
    url: "/user/delete",
    method: "post",
    data: { userId, ...data }
  });
}
export function enableUsers(data) {
  return request({
    url: "/user/enable",
    method: "post",
    data: { userId, ...data }
  });
}
export function disableUsers(data) {
  return request({
    url: "/user/disable",
    method: "post",
    data: { userId, ...data }
  });
}
export function getUserDetail(data) {
  return request({
    url: "/user/detail",
    method: "get",
    params: { ...data, userId }
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
