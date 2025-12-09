import dayjs from "dayjs";

import type { LabelList, PaginatedResult } from "@/types/api";

export const timestampToLocaleString = (timestamp?: number) => {
  if (!timestamp) return "-";
  return dayjs.unix(timestamp).format("YYYY-MM-DD HH:mm:ss");
};

export const transformLabelList = (data: PaginatedResult<Record<string, string>>["rows"]) => {
  if (!data) {
    return {} as LabelList;
  }
  const transformed: LabelList = {};
  data.forEach((item) => {
    const key = Object.keys(item)[0];
    const value = item[key];
    if (!transformed[key]) {
      transformed[key] = [];
    }
    if (value && !transformed[key].includes(value)) {
      transformed[key].push(value);
    }
  });
  return transformed;
};
