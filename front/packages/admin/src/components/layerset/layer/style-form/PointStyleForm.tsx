import React from 'react';
import { useTranslation } from "react-i18next";
import { LayerStyle } from "@mnd/shared/src/types/layerset/gql/graphql";

interface PointStyleFormProps {
  styleState: LayerStyle;
  onChange: <K extends keyof NonNullable<LayerStyle["context"]>>(key: K, value: string | number) => void;
}

const PointStyleForm = ({ styleState, onChange }: PointStyleFormProps) => {
  const { t } = useTranslation();

  return (
    <div>
      <label>{t("point-shape")}</label>
      <select
        value={styleState.context.shape}
        onChange={(e) => onChange("shape", e.target.value)}
      >
        <option value="circle">{t("circle")}</option>
        <option value="square">{t("square")}</option>
        <option value="triangle">{t("triangle")}</option>
        <option value="cross">{t("cross")}</option>
      </select>

      <label>{t("point-size")}</label>
      <input
        type="number"
        value={styleState.context.size}
        onChange={(e) => onChange("size", Number(e.target.value))}
      />

      <label>{t("stroke-color")}</label>
      <input
        type="color"
        value={styleState.context.strokeColor}
        onChange={(e) => onChange("strokeColor", e.target.value)}
      />

      <label>{t("stroke-width")}</label>
      <input
        type="number"
        value={styleState.context.strokeWidth}
        onChange={(e) => onChange("strokeWidth", Number(e.target.value))}
      />

      <label>{t("stroke-opacity")}</label>
      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={styleState.context.strokeOpacity}
        onChange={(e) => onChange("strokeOpacity", Number(e.target.value))}
      />

      <label>{t("fill-color")}</label>
      <input
        type="color"
        value={styleState.context.fillColor}
        onChange={(e) => onChange("fillColor", e.target.value)}
      />

      <label>{t("fill-opacity")}</label>
      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={styleState.context.fillOpacity}
        onChange={(e) => onChange("fillOpacity", Number(e.target.value))}
      />

      <label>최소 축적</label>
      <input
        type="number"
        value={styleState.context.minScale}
        onChange={(e) => onChange("minScale", Number(e.target.value))}
      />

      <label>최대 축적</label>
      <input
        type="number"
        value={styleState.context.maxScale}
        onChange={(e) => onChange("maxScale", Number(e.target.value))}
      />
    </div>
  );
};

export default PointStyleForm;
