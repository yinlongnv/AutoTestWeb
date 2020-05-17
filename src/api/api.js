import request from "@/utils/request";
let userInfo = sessionStorage.getItem("userInfo");
let userId = userInfo ? JSON.parse(sessionStorage.getItem("userInfo")).id : "";
export function createApi(data) {
  return request({
    url: "/api/createOrEdit",
    method: "post",
    data: { userId, ...data }
  });
}
export function getApiDetail(data) {
  return request({
    url: "/api/detail",
    method: "get",
    params: { ...data, userId }
  });
}
export function deleteApis(data) {
  return request({
    url: "/api/delete",
    method: "post",
    data: { userId, ...data }
  });
}
export function getfilterMap(data) {
  return request({
    url: "/api/filterMap",
    method: "get",
    param: data
  });
}
export function getfilterBaseUrl(data) {
  return request({
    url: "/api/filterBaseUrl",
    method: "get",
    param: data
  });
}
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
