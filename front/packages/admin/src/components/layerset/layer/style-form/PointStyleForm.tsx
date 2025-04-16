import React from 'react';
import {useTranslation} from "react-i18next";
import {CreateStyleInput, LayerStyle} from "@src/generated/gql/layerset/graphql";
import {UseFormRegister} from "react-hook-form";

interface PointStyleFormProps {
  register: UseFormRegister<CreateStyleInput>,
  styleState: LayerStyle,
  onChange: <K extends keyof NonNullable<LayerStyle["context"]>>(key: K, value: string | number) => void
}

const PointStyleForm = ({register, styleState, onChange}: PointStyleFormProps) => {
  const {t} = useTranslation();

  return (
    <div>
      <label>{t("point-shape")}</label>
      <select {...register("context.point.shape", {
        value: styleState.context.shape,
        onChange: (e) => onChange("shape", e.target.value)
      })}>
        <option value="circle">{t("circle")}</option>
        <option value="square">{t("square")}</option>
        <option value="triangle">{t("triangle")}</option>
        <option value="cross">{t("cross")}</option>
      </select>
      <label>{t("point-size")}</label>
      <input type="number"
             {...register("context.point.size", {
               value: styleState.context.size,
               onChange: (e) => onChange("size", Number(e.target.value))
             })}/>
      <label>{t("stroke-color")}</label>
      <input type="color"
             {...register("context.point.strokeColor", {
               value: styleState.context.strokeColor,
               onChange: (e) => onChange("strokeColor", e.target.value)
             })}/>
      <label>{t("stroke-width")}</label>
      <input type="number"
             {...register("context.point.strokeWidth", {
               value: styleState.context.strokeWidth,
               onChange: (e) => onChange("strokeWidth", Number(e.target.value))
             })}/>
      <label>{t("stroke-opacity")}</label>
      <input type="range" min={0} max={1} step={0.01}
             {...register("context.point.strokeOpacity", {
               value: styleState.context.strokeOpacity,
               onChange: (e) => onChange("strokeOpacity", Number(e.target.value))
             })}/>
      <label>{t("fill-color")}</label>
      <input type="color"
             {...register("context.point.fillColor", {
               value: styleState.context.fillColor,
               onChange: (e) => onChange("fillColor", e.target.value)
             })}/>
      <label>{t("fill-opacity")}</label>
      <input type="range" min={0} max={1} step={0.01}
             {...register("context.point.fillOpacity", {
               value: styleState.context.fillOpacity,
               onChange: (e) => onChange("fillOpacity", Number(e.target.value))
             })}/>
    </div>
  );
};

export default PointStyleForm;