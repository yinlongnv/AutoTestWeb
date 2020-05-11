import request from "@/utils/request";
let userInfo = sessionStorage.getItem("userInfo");
let userId = userInfo ? JSON.parse(sessionStorage.getItem("userInfo")).id : "";
export function createCase(data) {
  return request({
    url: "/case/createOrEdit",
    method: "post",
    data: { userId, ...data }
  });
}
export function getCaseDetail(data) {
  return request({
    url: "/case/detail",
    method: "get",
    params: { ...data, userId }
  });
}
export function deleteCases(data) {
  return request({
    url: "/case/delete",
    method: "post",
    data: { userId, ...data }
  });
}
export function getfilterMap(data) {
  return request({
    url: "/case/filterMap",
    method: "get",
    param: data
  });
}
