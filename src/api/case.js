import request from "@/utils/request";
let userInfo = sessionStorage.getItem("userInfo");
let userId = userInfo ? JSON.parse(sessionStorage.getItem("userInfo")).id : "";
// 创建/编辑用例
export function createCase(data) {
  return request({
    url: "/case/createOrEdit",
    method: "post",
    data: { userId, ...data }
  });
}
// 获取用例详情信息
export function getCaseDetail(data) {
  return request({
    url: "/case/detail",
    method: "get",
    params: { ...data, userId }
  });
}
// (批量)删除用例
export function deleteCases(data) {
  return request({
    url: "/case/delete",
    method: "post",
    data: { userId, ...data }
  });
}
// 获取关联接口信息下拉筛选框
export function getfilterMap(data) {
  return request({
    url: "/case/filterMap",
    method: "get",
    params: data
  });
}
// 批量导入用例数据
export function handleUpload(data) {
  return request({
    url: "/case/upload",
    method: "post",
    data,
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
}
// 执行指定用例
export function execute(data) {
  return request({
    url: "/case/execute",
    method: "get",
    params: { ...data, userId }
  });
}
