import React, {useEffect, useState} from 'react';
import {useRecoilValue} from "recoil";
import {editableStylesState, editingStyleState} from "@src/layer-style/recoils/layerStyle";
import {LayerType} from "@src/layer-style/models/EditableContextModel";

const LegendPreview = () => {

  const editableStyles = useRecoilValue(editableStylesState);
  const editingStyle = useRecoilValue(editingStyleState)
  const [currentStyles, setCurrentStyles] = useState(() => (
    editingStyle ? [editingStyle] : editableStyles
  ));

  useEffect(() => {
    const visibleOnly = editableStyles.filter(style => style.context.visible);
    const stylesToApply = editingStyle ? [editingStyle] : visibleOnly;
    setCurrentStyles(stylesToApply);
  }, [editingStyle, editableStyles]);

  return (
    <div className="legend-container">
      {currentStyles.map(style => {
        const {context} = style;
        if (context.type !== LayerType.ATTRIBUTE) return null;
        if (!context.attribute || context.rules.length <= 0) return null;

        const {comparisonType, rules} = context;

        return (
          <div key={style.id} className="legend-block">
            <div className="legend-title">{context.name}</div>
            <div className="legend-title">{context.attribute} 속성</div>
            <div className="legend-table">
              {rules.map((rule, idx) => {
                const valueLabel =
                  comparisonType === 'EQ'
                    ? `${rule.eq}`
                    : comparisonType === 'GE_LT'
                      ? `${rule.ge} 이상 ~ ${rule.lt} 미만`
                      : `${rule.gt} 초과 ~ ${rule.le} 이하`;

                return (
                  <div key={idx} className="legend-row">
                    <div className="legend-color" style={{
                      backgroundColor: rule.attributeColor,
                      opacity: rule.attributeOpacity
                    }}/>
                    <div className="legend-label">{valueLabel}</div>
                    <div className="legend-alias">{rule.alias || '-'}</div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default LegendPreview;