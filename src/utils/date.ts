import dayjs from "dayjs/esm/index.js";
import "dayjs/locale/zh-cn";

export function formatDate(date: string | number, format = "YYYY-MM-DD") {
  return dayjs(date).format(format);
}
