import request from "@/utils/request";
let userInfo = sessionStorage.getItem("userInfo");
let userId = userInfo ? JSON.parse(sessionStorage.getItem("userInfo")).id : "";
export function listWithSearch(data) {
  return request({
    url: "/notice/listWithSearch",
    method: "get",
    params: { userId, ...data }
  });
}
export function markRead(data) {
  return request({
    url: "/notice/markRead",
    method: "get",
    params: { userId, ...data }
  });
}
