import React from 'react';
import {UseFormRegister} from "react-hook-form";
import {CreateStyleInput, LayerStyle} from "@src/generated/gql/layerset/graphql";
import {useTranslation} from "react-i18next";

interface PolylineStyleFormProps {
  register: UseFormRegister<CreateStyleInput>,
  styleState: LayerStyle,
  onChange: <K extends keyof NonNullable<LayerStyle["context"]>>(key: K, value: string | number) => void
}

const PolylineStyleForm = ({register, styleState, onChange}: PolylineStyleFormProps) => {
  const {t} = useTranslation();

  return (
    <div>
      <label>{t("stroke-color")}</label>
      <input type="color"
             {...register("context.line.strokeColor", {
               value: styleState.context.strokeColor,
               onChange: (e) => onChange("strokeColor", e.target.value)
             })}/>
      <label>{t("stroke-width")}</label>
      <input type="number"
             {...register("context.line.strokeWidth", {
               value: styleState.context.strokeWidth,
               onChange: (e) => onChange("strokeWidth", Number(e.target.value))
             })}/>
      <label>{t("stroke-opacity")}</label>
      <input type="range" min={0} max={1} step={0.01}
             {...register("context.line.strokeOpacity", {
               value: styleState.context.strokeOpacity,
               onChange: (e) => onChange("strokeOpacity", Number(e.target.value))
             })}/>
    </div>
  );
};

export default PolylineStyleForm;