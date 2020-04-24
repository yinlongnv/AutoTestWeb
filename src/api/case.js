import request from "@/utils/request";
export function createCase(data) {
  return request({
    url: "/case/createOrEdit",
    method: "post",
    data
  });
}
export function getCaseDetail(data) {
  return request({
    url: "/case/detail",
    method: "get",
    params: data
  });
}
export function deleteCases(data) {
  return request({
    url: "/case/delete",
    method: "post",
    data
  });
}
