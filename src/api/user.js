import request from '@/utils/request'
export function createUser(data) {
  return request({
    url: '/user/create',
    method: 'post',
    data
  })
}
export function deleteItems(data) {
  return request({
    url: '/user/delete',
    method: 'post',
    data
  })
}
export function enableItems(data) {
  return request({
    url: '/user/enable',
    method: 'post',
    data
  })
}
export function disableItems(data) {
  return request({
    url: '/user/disable',
    method: 'post',
    data
  })
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

// 2.1管理员登录 POST /api/admin/login（已测试）~~
export function login(data) {
  return request({
    url: '/login',
    method: 'post',
    data
  })
}
// 2.2 管理员修改密码 POST /api/admin/change/pwd（已测试）
export function changePwd(data) {
  return request({
    url: '/change/pwd',
    method: 'post',
    data
  })
}
// 2.3 管理员退出登录POST /api/admin/logout（已测试）
// 2.4 通用/获取社区下拉列表 GET /api/admin/community/list（已测试）~~
export function getCommunityList(data) {
  return request({
    url: '/community/list',
    method: 'get',
    params: data
  })
}
// 2.5 通用/获取小区下拉列表 GET /api/admin/sudistrict/list（已测试）~~
export function getSudistrictLit(data) {
  return request({
    url: '/sudistrict/list',
    method: 'get',
    params: data
  })
}
// 2.6 数据分析/服务对象统计 GET /api/admin/dataany/svcobj（已测试）~~
export function getServiceObj(data) {
  return request({
    url: '/dataany/svcobj',
    method: 'get',
    params: data
  })
}
// 2.7 数据分析/获取服务人员列表 GET /api/admin/dataany/svcstaff /list（已测试）~~
export function getServiceStaff(data) {
  return request({
    url: '/dataany/svcstaff/list',
    method: 'get',
    params: data
  })
}
// 2.8 数据分析/服务项目分析  GET /api/admin/dataany/svcitem (未测试)
export function getServiceItem(data) {
  return request({
    url: '/dataany/svcitem',
    method: 'get',
    params: data
  })
}
// 2.27

// 2.9 老人管理/搜索老人列表 GET /api/admin/aged/search（已测试）~~
// 2.10 老人管理/删除 DELETE /api/admin/aged/ ~~
export function deleteAgedInfo(data) {
  return request({
    url: '/aged',
    method: 'delete',
    data
  })
}
// 2.11 老人管理/编辑 POST /api/admin/aged/edit（已测试）~~！
export function editAgedInfo(data) {
  return request({
    url: '/aged/edit',
    method: 'post',
    data
  })
}
// 2.12 老人管理/查看统计 GET /api/admin/aged/:id/statistic
export function getAgedStatistic(data) {
  return request({
    url: `/aged/${data.id}/statistic`,
    method: 'get'
  })
}
// 2.13 服务人员/搜索 GET /api/admin/svcstaff/search（已测试）~~
// 2.14 服务人员/获取人员详情 GET /api/admin/svcstaff/:id（已测试）~~
export function getSvcDetail(data) {
  return request({
    url: `/svcstaff/${data.id}`,
    method: 'get'
  })
}
// 2.15 服务人员/详情编辑 POST /api/admin/svcstaff/edit（已测试）~~
export function editSvcInfo(data) {
  return request({
    url: '/svcstaff/edit',
    method: 'post',
    data
  })
}
// 2.16 服务人员/添加 POST /api/admin/svcstaff/add（已测试）
export function addSvcInfo(data) {
  return request({
    url: '/svcstaff/add',
    method: 'post',
    data
  })
}
// 2.18 服务人员/删除 DELETE /api/admin/svcstaff/（已测试）~~
export function deleteSvcInfo(data) {
  return request({
    url: '/svcstaff',
    method: 'delete',
    data
  })
}
// 2.19 服务人员/启用/禁用 POST /api/admin/svcstaff/enable（已测试）
export function svcEnable(data) {
  return request({
    url: '/svcstaff/enable',
    method: 'post',
    data
  })
}
// 2.21 服务历史/搜索 GET /api/admin/svcrecord/search
// 2.22 服务历史/服务项目列表 GET /api/admin/svcrecord/svcitem/list
export function getSvcList(data) {
  return request({
    url: '/svcrecord/svcitem/list',
    method: 'get',
    params: data
  })
}
// 2.25 服务项目/搜索 GET /api/admin/svcitem/search
