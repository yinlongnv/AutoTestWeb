import request from "@/utils/request";
export function getfilterUserName(data) {
  return request({
    url: "/operateLog/filterUserName",
    method: "get",
    param: data
  });
}
