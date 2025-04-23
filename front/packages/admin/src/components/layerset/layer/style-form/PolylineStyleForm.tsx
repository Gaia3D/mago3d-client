import React from 'react';
import { LayerStyle } from "@mnd/shared/src/types/layerset/gql/graphql";
import { useTranslation } from "react-i18next";

interface PolylineStyleFormProps {
  styleState: LayerStyle;
  onChange: <K extends keyof NonNullable<LayerStyle["context"]>>(key: K, value: string | number) => void;
}

const PolylineStyleForm = ({ styleState, onChange }: PolylineStyleFormProps) => {
  const { t } = useTranslation();

  return (
    <div>
      <div className="style-group">
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
          <label htmlFor="border-color">{t("stroke-color")}</label>
          <input
            id="border-color"
            type="color"
            value={styleState.context.strokeColor}
            onChange={(e) => onChange("strokeColor", e.target.value)}
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
          <label htmlFor="border-type">외곽선 종류</label>
          <div className="custom-select">
            <div className="selected-option">
              <svg width="60" height="10">
              <line x1="0" y1="5" x2="60" y2="5" stroke="#000" stroke-width="2"/>
              </svg>
              실선
            </div>
            <ul className="select-options">
              <li data-value="solid">
                <svg width="60" height="10">
                  <line x1="0" y1="5" x2="60" y2="5" stroke="#000" stroke-width="2"/>
                </svg>
                실선
              </li>
              <li data-value="dotted">
                <svg width="60" height="10">
                  <line x1="0" y1="5" x2="60" y2="5" stroke="#000" stroke-width="2" stroke-dasharray="1, 5"/>
                </svg>
                점선
              </li>
              <li data-value="dashed">
                <svg width="60" height="10">
                  <line x1="0" y1="5" x2="60" y2="5" stroke="#000" stroke-width="2" stroke-dasharray="5, 5"/>
                </svg>
                파선
              </li>
              <li data-value="dash-dot">
                <svg width="60" height="10">
                  <line x1="0" y1="5" x2="60" y2="5" stroke="#000" stroke-width="2" stroke-dasharray="10, 5, 1, 5"/>
                </svg>
                1점 쇄선
              </li>
              <li data-value="dash-dot-dot">
                <svg width="60" height="10">
                  <line x1="0" y1="5" x2="60" y2="5" stroke="#000" stroke-width="2"
                        stroke-dasharray="10, 5, 1, 5, 1, 5"/>
                </svg>
                2점 쇄선
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PolylineStyleForm;
