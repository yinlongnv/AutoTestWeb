import request from "@/utils/request";
let userInfo = sessionStorage.getItem("userInfo");
let userId = userInfo ? JSON.parse(sessionStorage.getItem("userInfo")).id : "";
export function exportAllLogs(data) {
  return request({
    url: "/operateLog/exportAllLogs",
    method: "get",
    params: { ...data, userId }
  });
}
export function getfilterUserName(data) {
  return request({
    url: "/operateLog/filterUserName",
    method: "get",
    param: data
  });
}