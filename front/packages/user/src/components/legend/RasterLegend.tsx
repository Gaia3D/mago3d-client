import React from 'react';
import { ColorMapEntry, ColorMapType } from "@mnd/shared/src/types/layerset/gql/graphql.ts";

const RasterLegend = (
  assetName: string,
  rasterType: string,
  entries: ColorMapEntry[],
  styleId: string
) => {
  const renderRampLegend = () => (
    <div className="legend-ramp-row">
      <div
        className="legend-ramp-color"
        style={{
          background: `linear-gradient(to bottom, ${entries
            .map(entry => {
              const color = entry.color ?? "#000000";
              const hex = color.replace("#", "");
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
          </div>
        ))}
      </div>
    </div>
  );

  const renderIntervalLegend = () => {
    const intervalEntries = entries.filter((_, index) => index % 2 === 0);
    return intervalEntries.map((entry, idx) => {
      const next = entries[(idx + 1) * 2]; // intervalEntries 기준이 아니라 원본 entries 기준 인덱스 계산
      const label = next
        ? `${entry.bandValue} 이상 ~ ${next.bandValue} 미만`
        : `${entry.bandValue} 이상`;

      return (
        <div key={idx} className="legend-row">
          <div
            className="legend-color"
            style={{
              backgroundColor: entry.color ?? "#000000",
              opacity: entry.entryOpacity ?? 1,
            }}
          />
          <div className="legend-alias">{entry.textLabel || '-'}</div>
          {/*<div className="legend-label">{label}</div>*/}
        </div>
      );
    });
  };

  const renderDiscreteLegend = () =>
    entries.map((entry, idx) => (
      <div key={idx} className="legend-row">
        <div
          className="legend-color"
          style={{
            backgroundColor: entry.color ?? "#000000",
            opacity: entry.entryOpacity ?? 1,
          }}
        />
        <div className="legend-alias">{entry.textLabel || '-'}</div>
        <div className="legend-label">{entry.bandValue ?? '-'}</div>
      </div>
    ));

  return (
    <div key={`raster-${styleId}`} className="legend-block">
      <div className="legend-title">{assetName}</div>
      <div className="legend-table">
        {rasterType === ColorMapType.Ramp
          ? renderRampLegend()
          : rasterType === ColorMapType.Intervals
            ? renderIntervalLegend()
            : renderDiscreteLegend()}
      </div>
    </div>
  );
};

export default RasterLegend;
