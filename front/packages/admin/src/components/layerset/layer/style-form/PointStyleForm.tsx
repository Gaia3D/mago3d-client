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
      <div className="style-group">
        <div className="form-row">
          <label htmlFor="point-style">{t("point-shape")}</label>
          <select
            id="point-style"
            value={styleState.context.shape}
            onChange={(e) => onChange("shape", e.target.value)}
          >
            <option value="circle">{t("circle")}</option>
            <option value="square">{t("square")}</option>
            <option value="triangle">{t("triangle")}</option>
            <option value="cross">{t("cross")}</option>
          </select>
        </div>
        <div className="form-row">
          <label htmlFor="point-size">{t("point-size")}</label>
          <input
            id="point-size"
            type="number"
            value={styleState.context.size}
            onChange={(e) => onChange("size", Number(e.target.value))}
          />
        </div>
        <div className="form-row">
          <label htmlFor="border-color">{t("stroke-color")}</label>
          <input
            id="border-color"
            type="color"
            value={styleState.context.strokeColor}
            onChange={(e) => onChange("strokeColor", e.target.value)}
          />
        </div>
        <div className="form-row">
          <label htmlFor="border-width">{t("stroke-width")}</label>
          <input
            id="border-width"
            type="number"
            value={styleState.context.strokeWidth}
            onChange={(e) => onChange("strokeWidth", Number(e.target.value))}
          />
        </div>
        <div className="form-row">
          <label htmlFor="border-opacity">{t("stroke-opacity")}</label>
          <input
            id="border-opacity"
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={styleState.context.strokeOpacity}
            onChange={(e) => onChange("strokeOpacity", Number(e.target.value))}
          />
        </div>
        <div className="form-row">
          <label htmlFor="fill-color">{t("fill-color")}</label>
          <input
            id="fill-color"
            type="color"
            value={styleState.context.fillColor}
            onChange={(e) => onChange("fillColor", e.target.value)}
          />
        </div>
        <div className="form-row">
          <label htmlFor="fill-opacity">{t("fill-opacity")}</label>
          <input
            id="fill-opacity"
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={styleState.context.fillOpacity}
            onChange={(e) => onChange("fillOpacity", Number(e.target.value))}
          />
        </div>
      </div>
      <div className="style-group">
        <div className="form-row">
          <label htmlFor="label-type">라벨</label>
          <label className="switch">
            <input type="checkbox" id="label-type"/>
            <span className="slider"></span>
          </label>
        </div>
        <div className="form-row">
          <label htmlFor="attribute-name">속성명</label>
          <select id="attribute-name">
            <option>속성명</option>
            <option>속성명</option>
          </select>
        </div>
        <div className="form-row">
          <label htmlFor="font-type">폰트종류</label>
          <select id="font-type">
            <option>돋움</option>
            <option>굴림</option>
          </select>
        </div>
        <div className="form-row">
          <label htmlFor="font-size">폰트사이즈</label>
          <select id="font-size">
            <option>10pt</option>
            <option>11pt</option>
            <option>12pt</option>
          </select>
        </div>
        <div className="form-row">
          <label htmlFor="font-color">폰트 색상</label>
          <input type="color" id="font-color"/>
        </div>
        <div className="form-row">
          <label>테두리 여부</label>
          <div className="input-radio">
            <label>
              <input type="radio" name="border" value="yes"/>
              있음
            </label>
          </div>
          <div className="input-radio">
            <label>
              <input type="radio" name="border" value="no"/>
              없음
            </label>
          </div>
        </div>
        <div className="form-row">
          <label htmlFor="">테두리 색상</label>
          <input type="color" id=""/>
        </div>
      </div>

    </div>
  );
};

export default PointStyleForm;
