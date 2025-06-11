import React, { useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { editableStylesState, editingStyleState } from '@src/layer-style/recoils/layerStyle';
import { ColorMapType } from '@mnd/shared/src/types/layerset/gql/graphql';

const hexToRgba = (hex: string, alpha = 1) => {
  const cleanHex = hex.replace('#', '');
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const renderIntervalsLegend = (entries: any[]) =>
  entries.map((entry, idx) => {
    const next = entries[idx + 1];
    const range = next
      ? `${entry.bandValue} 이상 ~ ${next.bandValue} 미만`
      : `${entry.bandValue} 이상`;

    return (
      <div key={idx} className="legend-row">
        <div className="legend-color" style={{ backgroundColor: entry.color, opacity: entry.entryOpacity ?? 1 }} />
        <div className="legend-alias">{entry.textLabel || '-'}</div>
        <div className="legend-label">{range}</div>
      </div>
    );
  });

const renderRampLegend = (entries: any[]) => (
  <div className="legend-ramp-row">
    <div
      className="legend-ramp-color"
      style={{
        background: `linear-gradient(to bottom, ${entries
          .map(entry => hexToRgba(entry.color, entry.entryOpacity ?? 1))
          .join(', ')})`,
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
);

const renderDefaultLegend = (entries: any[]) =>
  entries.map((entry, idx) => (
    <div key={idx} className="legend-row">
      <div className="legend-color" style={{ backgroundColor: entry.color, opacity: entry.entryOpacity ?? 1 }} />
      <div className="legend-alias">{entry.textLabel || '-'}</div>
      <div className="legend-label">{entry.bandValue ?? '-'}</div>
    </div>
  ));

const LegendPreview = () => {
  const editableStyles = useRecoilValue(editableStylesState);
  const editingStyle = useRecoilValue(editingStyleState);

  const currentStyles = useMemo(
    () => (editingStyle ? [editingStyle] : editableStyles.filter(style => style.context.visible)),
    [editingStyle, editableStyles]
  );

  return (
    <div className="legend-container">
      {currentStyles.map(style => {
        const { context } = style;
        const { entries, type } = context.raster;
        if (!entries?.length) return null;

        return (
          <div key={style.id} className="legend-block">
            <div className="legend-title">{context.name}</div>
            <div className="legend-table">
              {type === ColorMapType.Intervals
                ? renderIntervalsLegend(entries)
                : type === ColorMapType.Ramp
                  ? renderRampLegend(entries)
                  : renderDefaultLegend(entries)}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default LegendPreview;
