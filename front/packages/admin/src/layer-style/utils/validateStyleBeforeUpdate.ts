import {EditableStyleModel} from "@src/layer-style/models/EditableStyleModel";
import {LayerType} from "@src/layer-style/models/EditableContextModel";

export const validateStyleBeforeUpdate = (style: EditableStyleModel): string | null => {
  const { context } = style;

  // 예외 1: 속성 스타일인데 속성만 있고 분류하지 않음
  if (
    context.type === LayerType.ATTRIBUTE &&
    context.rules.length === 0
  ) {
    return 'ATTRIBUTE를 선택했지만 속성을 분류하지 않았습니다.';
  }


  return null;
};
