import request from "@/utils/request";
export function createApi(data) {
  return request({
    url: "/api/createOrEdit",
    method: "post",
    data
  });
}
export function getApiDetail(data) {
  return request({
    url: "/api/detail",
    method: "get",
    params: data
  });
}
export function deleteApis(data) {
  return request({
    url: "/api/delete",
    method: "post",
    data
  });
}
export function getfilterMap(data) {
  return request({
    url: "/api/filterMap",
    method: "get",
    param: data
  });
}
