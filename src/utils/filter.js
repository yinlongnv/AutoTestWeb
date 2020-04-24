import dayjs from "dayjs";
export function sexFilter(val) {
  if (val === 1) {
    return "男";
  } else {
    return "女";
  }
}
export function timeFilter(val) {
  if (val) {
    return dayjs(val).format("YYYY-MM-DD hh:mm:ss");
  } else {
    return "-";
  }
}
export function statusFilter(val) {
  if (val) {
    return "禁用";
  } else {
    return "启用";
  }
}
export function roleFilter(val) {
  if (val) {
    return "root";
  } else {
    return "QA";
  }
}
export function reqMethodFilter(val) {
  if (val) {
    return "get";
  } else {
    return "post";
  }
}
