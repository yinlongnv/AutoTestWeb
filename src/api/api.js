import request from "@/utils/request";
let userInfo = sessionStorage.getItem("userInfo");
let userId = userInfo ? JSON.parse(sessionStorage.getItem("userInfo")).id : "";
// 创建/编辑接口
export function createApi(data) {
  return request({
    url: "/api/createOrEdit",
    method: "post",
    data: { userId, ...data }
  });
}
// 获取接口详情信息
export function getApiDetail(data) {
  return request({
    url: "/api/detail",
    method: "get",
    params: { ...data, userId }
  });
}
// (批量)删除接口
export function deleteApis(data) {
  return request({
    url: "/api/delete",
    method: "post",
    data: { userId, ...data }
  });
}
// 获取业务分组下拉筛选框内容
export function getfilterMap(data) {
  return request({
    url: "/api/filterMap",
    method: "get",
    param: data
  });
}
// 获取环境域名下拉筛选内容
export function getfilterBaseUrl(data) {
  return request({
    url: "/api/filterBaseUrl",
    method: "get",
    param: data
  });
}
// 批量导入接口数据
export function handleUpload(data) {
  return request({
    url: "/api/upload",
    method: "post",
    data: { userId, ...data },
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
}
