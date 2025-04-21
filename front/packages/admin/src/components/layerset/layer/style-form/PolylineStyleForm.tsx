import React from 'react';
import { LayerStyle } from "@src/generated/gql/layerset/graphql";
import { useTranslation } from "react-i18next";

interface PolylineStyleFormProps {
  styleState: LayerStyle;
  onChange: <K extends keyof NonNullable<LayerStyle["context"]>>(key: K, value: string | number) => void;
}

const PolylineStyleForm = ({ styleState, onChange }: PolylineStyleFormProps) => {
  const { t } = useTranslation();

  return (
    <div>
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
    </div>
  );
};

export default PolylineStyleForm;
