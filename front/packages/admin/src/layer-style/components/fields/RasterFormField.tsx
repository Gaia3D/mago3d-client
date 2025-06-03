import React from 'react';
import {EditableContextModel} from "@src/layer-style/models/EditableContextModel";
import CommonFormField from "@src/layer-style/components/fields/CommonFormField";
import {FieldRow} from "@src/layer-style/components/fields/FieldRow";
import {ColorMapType, ContrastMethod, RasterStyleInput} from "@mnd/shared/src/types/layerset/gql/graphql";
import RasterEntryTable from "@src/layer-style/components/fields/entry/RasterEntryTable";

interface RasterFormFieldProps {
  context: EditableContextModel;
  onChange: <K extends keyof EditableContextModel>(
    field: K,
    value: EditableContextModel[K]
  ) => void;
}

const RasterFormField = ({context, onChange}: RasterFormFieldProps) => {

  const handleRasterFieldChange = <K extends keyof RasterStyleInput>(
    key: K,
    value: RasterStyleInput[K]
  ) => {
    onChange("raster", {
      ...context.raster,
      [key]: value,
    });
  };

  return (
    <>
      <CommonFormField context={context} onChange={onChange}/>

      <FieldRow
        id="raster-opacity"
        label="투명도"
        type="number"
        value={context.raster.opacity ?? 1.0}
        onChange={(value) => handleRasterFieldChange("opacity", value)}
        min={0}
        max={1}
        step={0.05}
      />

      <FieldRow
        id="raster-type"
        label="명암 대비 방식"
        type="select"
        value={context.raster.mode ?? ContrastMethod.Normalize}
        onChange={(value) => handleRasterFieldChange("mode", value)}
        options={[
          {value: ContrastMethod.Normalize, label: "NORMALIZE"},
          {value: ContrastMethod.Histogram, label: "HISTOGRAM"},
        ]}
      />

      <FieldRow
        id="raster-gamma"
        label="감마 보정"
        type="number"
        value={context.raster.gamma ?? 1.0}
        onChange={(value) => handleRasterFieldChange("gamma", value)}
        min={0.1}
        max={5}
        step={0.1}
      />

      <FieldRow
        id="raster-type"
        label="생상 분류 방식"
        type="select"
        value={context.raster.type ?? ColorMapType.Ramp}
        onChange={(value) => handleRasterFieldChange("type", value)}
        options={[
          {value: ColorMapType.Ramp, label: "램프(RAMP)"},
          {value: ColorMapType.Values, label: "값(VALUES)"},
          {value: ColorMapType.Intervals, label: "간격(INTERVALS)"},
        ]}
      />

      <RasterEntryTable context={context} onChange={onChange} />
    </>
  );
};

export default RasterFormField;
