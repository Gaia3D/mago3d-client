import { EditableContextModel } from "../models/EditableContextModel";

//  이중 패치된 entry 배열을 원본 형태로 짝수 인덱스만 유지
export const normalizeIntervalEntries = (
  entries: EditableContextModel["raster"]["entries"]
): EditableContextModel["raster"]["entries"] => {
  return entries.filter((_, index) => index % 2 === 0);
};

// 가장 앞에 넣어둔 더미 entry 제거
export const normalizeRampEntries = (
  entries: EditableContextModel["raster"]["entries"]
): EditableContextModel["raster"]["entries"] => {
  if (!entries || entries.length < 2) return entries;

  const [first, second] = entries;

  const isDummy =
    typeof first.entryOpacity === "number" &&
    first.entryOpacity === 0 &&
    first.color === second.color;

  return isDummy ? entries.slice(1) : entries;
};
