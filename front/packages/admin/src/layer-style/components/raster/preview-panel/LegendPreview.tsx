import React, {useEffect, useState} from 'react';
import {useRecoilValue} from "recoil";
import {editableStylesState, editingStyleState} from "@src/layer-style/recoils/layerStyle";

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
        const { entries, type } = context.raster;
        if (!entries || entries.length === 0) return null;

        return (
          <div key={style.id} className="legend-block">
            <div className="legend-title">{context.name}</div>
            <div className="legend-title">컬러맵 타입: {type}</div>
            <div className="legend-table">
              {entries.map((entry, idx) => (
                <div key={idx} className="legend-row">
                  <div
                    className="legend-color"
                    style={{
                      backgroundColor: entry.color,
                      opacity: entry.entryOpacity ?? 1,
                    }}
                  />
                  <div className="legend-label">
                    {entry.bandValue ?? "-"}
                  </div>
                  <div className="legend-alias">
                    {entry.textLabel || "-"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default LegendPreview;