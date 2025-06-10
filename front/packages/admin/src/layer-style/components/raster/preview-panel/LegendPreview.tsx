import React, {useEffect, useState} from 'react';
import {useRecoilValue} from "recoil";
import {editableStylesState, editingStyleState} from "@src/layer-style/recoils/layerStyle";
import {ColorMapType} from "@mnd/shared/src/types/layerset/gql/graphql";

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
            <div className="legend-table">
              {type === ColorMapType.Ramp ? (
                <div className="legend-ramp-row">
                  <div
                    className="legend-ramp-color"
                    style={{
                      background: `linear-gradient(to bottom, ${entries
                        .map(entry => {
                          const hex = entry.color.replace("#", "");
                          const r = parseInt(hex.substring(0, 2), 16);
                          const g = parseInt(hex.substring(2, 4), 16);
                          const b = parseInt(hex.substring(4, 6), 16);
                          const a = entry.entryOpacity ?? 1;
                          return `rgba(${r}, ${g}, ${b}, ${a})`;
                        })
                        .join(", ")})`,
                    }}
                  />
                  <div className="legend-ramp-rows">
                    {entries.map((entry, idx) => (
                      <div key={idx} className="legend-ramp-row-item">
                        <div className="legend-ramp-alias">{entry.textLabel || '-'}</div>
                        <div className="legend-ramp-value">{entry.bandValue ?? '-'}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                entries.map((entry, idx) => (
                  <div key={idx} className="legend-row">
                    <div
                      className="legend-color"
                      style={{
                        backgroundColor: entry.color,
                        opacity: entry.entryOpacity ?? 1,
                      }}
                    />
                    <div className="legend-alias">{entry.textLabel || '-'}</div>
                    <div className="legend-label">{entry.bandValue ?? '-'}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default LegendPreview;