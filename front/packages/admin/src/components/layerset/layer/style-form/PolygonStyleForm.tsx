import React from 'react';
import { LayerStyle } from "@mnd/shared/src/types/layerset/gql/graphql";
import { useTranslation } from "react-i18next";

interface PolygonStyleFormProps {
  styleState: LayerStyle;
  onChange: <K extends keyof NonNullable<LayerStyle["context"]>>(key: K, value: string | number) => void;
}

const PolygonStyleForm = ({ styleState, onChange }: PolygonStyleFormProps) => {
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
            <div className="selected-option">실선</div>
          </div>
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
        <div className="form-row">
          <label htmlFor="fill-pattern">채우기 패턴</label>
          <div className="custom-select">
            <div className="selected-option">
              <svg width="60" height="20">
              <rect width="60" height="20" fill="url(#pattern-horizontal)"/>
              </svg>
              가로
            </div>
            <ul className="select-options">
              <li data-value="horizontal">
                <svg width="60" height="20">
                  <defs>
                    <pattern id="pattern-horizontal" width="4" height="4" patternUnits="userSpaceOnUse">
                      <path d="M 0 0 H 4" stroke="purple" stroke-width="1"/>
                    </pattern>
                  </defs>
                  <rect width="60" height="20" fill="url(#pattern-horizontal)"/>
                </svg>
                가로
              </li>
              <li data-value="vertical">
                <svg width="60" height="20">
                  <defs>
                    <pattern id="pattern-vertical" width="4" height="4" patternUnits="userSpaceOnUse">
                      <path d="M 0 0 V 4" stroke="purple" stroke-width="1"/>
                    </pattern>
                  </defs>
                  <rect width="60" height="20" fill="url(#pattern-vertical)"/>
                </svg>
                세로
              </li>
              <li data-value="diagonal">
                <svg width="60" height="20">
                  <defs>
                    <pattern id="pattern-diagonal" width="6" height="6" patternUnits="userSpaceOnUse">
                      <path d="M 0 6 L 6 0" stroke="purple" stroke-width="1"/>
                    </pattern>
                  </defs>
                  <rect width="60" height="20" fill="url(#pattern-diagonal)"/>
                </svg>
                대각
              </li>
              <li data-value="reverse-diagonal">
                <svg width="60" height="20">
                  <defs>
                    <pattern id="pattern-reverse-diagonal" width="6" height="6" patternUnits="userSpaceOnUse">
                      <path d="M 0 0 L 6 6" stroke="purple" stroke-width="1"/>
                    </pattern>
                  </defs>
                  <rect width="60" height="20" fill="url(#pattern-reverse-diagonal)"/>
                </svg>
                역대각
              </li>
              <li data-value="cross">
                <svg width="60" height="20">
                  <defs>
                    <pattern id="pattern-cross" width="6" height="6" patternUnits="userSpaceOnUse">
                      <path d="M 0 3 H 6 M 3 0 V 6" stroke="purple" stroke-width="1"/>
                    </pattern>
                  </defs>
                  <rect width="60" height="20" fill="url(#pattern-cross)"/>
                </svg>
                십자
              </li>
              <li data-value="x-cross">
                <svg width="60" height="20">
                  <defs>
                    <pattern id="pattern-x-cross" width="6" height="6" patternUnits="userSpaceOnUse">
                      <path d="M 0 0 L 6 6 M 6 0 L 0 6" stroke="purple" stroke-width="1"/>
                    </pattern>
                  </defs>
                  <rect width="60" height="20" fill="url(#pattern-x-cross)"/>
                </svg>
                엑스
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PolygonStyleForm;
