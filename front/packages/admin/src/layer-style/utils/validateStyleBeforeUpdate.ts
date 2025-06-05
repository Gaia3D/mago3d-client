import {EditableStyleModel} from "@src/layer-style/models/EditableStyleModel";
import {LayerType} from "@src/layer-style/models/EditableContextModel";

export const validateStyleBeforeUpdate = (style: EditableStyleModel): string | null => {
  const { context } = style;

  // 예외 1: 속성 스타일인데 속성만 있고 분류하지 않음
  if (
    context.type === LayerType.ATTRIBUTE &&
    context.rules.length === 0
  ) {
    return "ATTRIBUTE를 선택했지만 속성을 분류하지 않았습니다.";
  }

  // 예외 2: 라벨 사용은 했지만 라벨 속성은 선택하지 않음
  if (
    context.isLabel &&
    !context.labelAttribute
  ) {
    return "라벨은 허용했지만 라벨 속성을 선택하지 않았습니다.";
  }

  // 예외 3: 아이콘 스타일을 선택했지만 아이콘은 선택하지 않음
  if (
    context.isIcon &&
    !context.iconSymbolId
  ) {
    return "아이콘을 선택해주세요."
  }

  return null;
};
