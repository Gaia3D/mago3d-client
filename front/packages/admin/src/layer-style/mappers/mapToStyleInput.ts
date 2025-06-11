import {
  PointStyleInput,
  LineStyleInput,
  PolygonStyleInput,
} from "@mnd/shared/src/types/layerset/gql/graphql";
import { EditableContextModel } from "../models/EditableContextModel";
import {buildIcon, buildLabel} from "@src/layer-style/utils/contextBuilder";

export const buildPointStyle = (editable: EditableContextModel): PointStyleInput => ({
  minScale: editable.minScale,
  maxScale: editable.maxScale,
  fillColor: editable.fillColor,
  fillOpacity: editable.fillOpacity,
  strokeColor: editable.strokeColor,
  strokeOpacity: editable.strokeOpacity,
  strokeWidth: editable.strokeWidth,
  size: editable.size,
  shape: editable.isShape ? editable.shape : undefined,
  labelStyle: buildLabel(editable),
  iconStyle: buildIcon(editable),
});

export const buildLineStyle = (editable: EditableContextModel): LineStyleInput => ({
  minScale: editable.minScale,
  maxScale: editable.maxScale,
  strokeColor: editable.strokeColor,
  strokeOpacity: editable.strokeOpacity,
  strokeWidth: editable.strokeWidth,
  strokeDasharray: editable.strokeDasharray,
  labelStyle: buildLabel(editable),
});

export const buildPolygonStyle = (editable: EditableContextModel): PolygonStyleInput => ({
  minScale: editable.minScale,
  maxScale: editable.maxScale,
  fillColor: editable.fillColor,
  fillOpacity: editable.fillOpacity,
  strokeColor: editable.strokeColor,
  strokeOpacity: editable.strokeOpacity,
  strokeWidth: editable.strokeWidth,
  strokeDasharray: editable.strokeDasharray,
  fillGraphic: editable.isShape
    ? {
      shape: editable.shape,
      fillColor: editable.fillColor,
      fillOpacity: editable.fillOpacity,
      strokeColor: editable.fillColor,
      strokeOpacity: editable.fillOpacity,
    }
    : undefined,
  labelStyle: buildLabel(editable),
});
