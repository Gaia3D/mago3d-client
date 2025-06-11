import { EditableContextModel } from "../models/EditableContextModel";

export const buildLabel = (editable: EditableContextModel) => {
  if (!editable.isLabel) return undefined;
  return {
    attributeName: editable.labelAttribute,
    fillColor: editable.labelFillColor,
    fillOpacity: editable.labelFillOpacity,
    fontSize: editable.labelFontSize,
    halo: editable.isHalo
      ? {
        fillColor: editable.haloFillColor,
        fillOpacity: editable.haloFillOpacity,
        radius: 2,
      }
      : undefined,
  };
};

export const buildIcon = (editable: EditableContextModel) => {
  if (!editable.isIcon) return undefined;
  return {
    scale: editable.iconScale,
    symbolId: editable.iconSymbolId,
  };
};
